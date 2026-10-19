import axios from 'axios';

// GitHub Pages 静态部署模式：从 /data/ 目录加载预渲染的 JSON 文件
const http = axios.create({ baseURL: import.meta.env.BASE_URL });

// 文档内容会话缓存
const docCache = new Map();
export const getCachedDoc = (docPath) => docCache.get(docPath);

/** 把文档路径转成文件名（斜杠 → 双下划线） */
function pathToFile(docPath) {
  return docPath.replace(/\.md$/, '').replace(/[\/]/g, '__');
}

// 获取目录树
export const getTree = () =>
  http.get('data/tree.json').then((r) => r.data);

// 获取单篇文档
export const getDoc = (docPath) => {
  const hit = docCache.get(docPath);
  if (hit) return Promise.resolve(hit);
  const fileName = pathToFile(docPath);
  return http.get(`data/docs/${fileName}.json`).then((r) => {
    docCache.set(docPath, r.data);
    return r.data;
  });
};

// 静态模式下不支持解锁，直接返回
export const unlockDoc = (docPath, password) =>
  Promise.reject(new Error('静态部署模式不支持加密文档'));

// 首页内容
let homeCache = null;
export const getCachedHome = () => homeCache;
export const getHome = () => {
  if (homeCache) return Promise.resolve(homeCache);
  return http.get('data/home.json').then((r) => {
    homeCache = r.data;
    return r.data;
  });
};

// 前端本地搜索（简单实现：遍历所有文档标题和内容）
let allDocs = null;
async function loadAllDocsForSearch() {
  if (allDocs) return allDocs;
  const treeRes = await getTree();
  const docs = [];
  function walk(items) {
    for (const item of items) {
      if (item.type === 'dir') {
        walk(item.children || []);
      } else if (item.type === 'file' && item.kind === 'md') {
        docs.push(item);
      }
    }
  }
  walk(treeRes.categories || []);
  allDocs = docs;
  return docs;
}

export const searchNotes = async (q) => {
  if (!q || !q.trim()) return { results: [] };
  const docs = await loadAllDocsForSearch();
  const keywords = q.trim().toLowerCase().split(/\s+/);

  // 加载每个文档的内容进行搜索
  const results = [];
  for (const doc of docs) {
    try {
      const fileName = pathToFile(doc.path);
      const res = await http.get(`data/docs/${fileName}.json`);
      const contentText = res.data.content.replace(/<[^>]+>/g, '').toLowerCase();
      const titleText = doc.name.toLowerCase();

      let score = 0;
      let match = false;
      for (const kw of keywords) {
        if (titleText.includes(kw)) {
          score += 10;
          match = true;
        }
        if (contentText.includes(kw)) {
          score += 1;
          match = true;
        }
      }
      if (match) {
        results.push({
          ...doc,
          score,
          snippet: contentText.slice(0, 100) + '...',
        });
      }
    } catch (e) {
      // 忽略加载失败的文档
    }
  }
  // 按相关度排序
  results.sort((a, b) => b.score - a.score);
  return { results };
};

// 站点配置
export const getSiteConfig = () => http.get('data/site-config.json').then((r) => r.data);

// 静态模式下没有用户系统
export const getMe = () => Promise.resolve({ user: null });
