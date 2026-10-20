#!/usr/bin/env node
/**
 * 预构建脚本：把 note/ 目录的 Markdown 文件预渲染成静态 JSON，
 * 输出到 web/public/data/ 目录，供 GitHub Pages 纯静态部署使用。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const NOTE_DIR = path.join(ROOT_DIR, 'note');
const OUT_DIR = path.join(ROOT_DIR, 'web', 'public', 'data');

// 确保输出目录存在
fs.mkdirSync(OUT_DIR, { recursive: true });

// 配置 markdown-it（与后端保持一致）
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs language-${lang}"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

/** 提取标题 TOC */
function extractToc(html) {
  const toc = [];
  const regex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, '').trim();
    toc.push({ level, id, text });
  }
  return toc;
}

/** 给标题加 id（简单版：基于文本生成 slug） */
function addHeadingIds(html) {
  let counter = 0;
  return html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (_, level, text) => {
    const id = `heading-${counter++}`;
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

/** 递归扫描目录生成树 */
function scanDir(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // 跳过 assets 目录
      if (entry.name === 'assets') continue;
      result.push({
        type: 'dir',
        name: entry.name,
        path: relPath.replace(/\\/g, '/'),
        order: 999,
        children: scanDir(fullPath, relPath),
      });
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // 根目录的 README.md 作为首页，不出现在侧边栏文件列表里
      if (basePath === '' && entry.name === 'README.md') continue;
      const name = entry.name.replace(/\.md$/, '');
      result.push({
        type: 'file',
        name,
        path: relPath.replace(/\\/g, '/'),
        kind: 'md',
        order: 999,
        redirect: null,
      });
    }
  }

  // 排序：目录在前，文件在后，按名称排序
  return result.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name, 'zh');
  });
}

/** 渲染单个 md 文件 */
function renderDoc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let html = md.render(raw);
  html = addHeadingIds(html);
  const toc = extractToc(html);
  return { html, toc, raw };
}

// ========== 主流程 ==========

console.log('📦 预构建静态文档数据...');
console.log(`   note 目录: ${NOTE_DIR}`);
console.log(`   输出目录: ${OUT_DIR}`);

// 1. 生成目录树
const tree = scanDir(NOTE_DIR);
fs.writeFileSync(path.join(OUT_DIR, 'tree.json'), JSON.stringify({ categories: tree }, null, 2));
console.log(`✅ tree.json  (${tree.length} 个分类)`);

// 2. 生成首页（README.md）
const homePath = path.join(NOTE_DIR, 'README.md');
if (fs.existsSync(homePath)) {
  const { html, toc } = renderDoc(homePath);
  fs.writeFileSync(path.join(OUT_DIR, 'home.json'), JSON.stringify({
    exists: true,
    title: '全能签安装教程',
    html: html,
    toc: toc,
  }, null, 2));
  console.log('✅ home.json  (首页)');
}

// 3. 生成每篇文档
const docsDir = path.join(OUT_DIR, 'docs');
fs.mkdirSync(docsDir, { recursive: true });

function processFiles(entries, baseDir) {
  for (const entry of entries) {
    if (entry.type === 'dir') {
      processFiles(entry.children, path.join(baseDir, entry.name));
    } else if (entry.type === 'file' && entry.kind === 'md') {
      const filePath = path.join(NOTE_DIR, entry.path);
      const { html, toc } = renderDoc(filePath);
      // 用路径作为文件名，斜杠替换为 __
      const fileName = entry.path.replace(/\.md$/, '').replace(/[\/]/g, '__') + '.json';
      fs.writeFileSync(path.join(docsDir, fileName), JSON.stringify({
        title: entry.name,
        html: html,
        toc: toc,
        path: entry.path,
        kind: 'md',
      }, null, 2));
      console.log(`   📄 ${entry.path}`);
    }
  }
}
processFiles(tree, NOTE_DIR);

// 4. 复制 site.config.json
const siteConfigSrc = path.join(ROOT_DIR, 'server', 'site.config.json');
if (fs.existsSync(siteConfigSrc)) {
  fs.copyFileSync(siteConfigSrc, path.join(OUT_DIR, 'site-config.json'));
  console.log('✅ site-config.json');
}

console.log('🎉 预构建完成！');
