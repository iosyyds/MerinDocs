<script setup>
import { ref, onMounted } from 'vue';
import DocContent from '../components/DocContent.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { getHome, getCachedHome } from '../api';
import { siteConfig } from '../siteConfig';
import { hideViewLoading } from '../loading';

const doc = ref(null);
const loading = ref(true);
const missing = ref(false);
const welcomeMode = ref(true);

function applyHome(data) {
  doc.value = {
    title: data.title,
    html: data.html,
    toc: data.toc,
    category: '',
    prev: null,
    next: null,
  };
}

onMounted(async () => {
  document.title = siteConfig.value.siteTitle;
  const hit = getCachedHome();
  if (hit) {
    if (hit.exists) applyHome(hit);
    else missing.value = true;
    loading.value = false;
    hideViewLoading();
    return;
  }
  try {
    const data = await getHome();
    if (data.exists) applyHome(data);
    else missing.value = true;
  } catch (e) {
    console.error('加载首页失败', e);
    missing.value = true;
  } finally {
    loading.value = false;
    hideViewLoading();
  }
});
</script>

<template>
  <ProgressBar :loading="loading" />
  <Transition name="overlay-fade">
    <div v-if="loading" class="doc-loading-overlay">
      <div class="doc-loading-center">
        <div class="spinner" aria-hidden="true"></div>
        <p>加载中…</p>
      </div>
    </div>
  </Transition>

  <div v-if="welcomeMode && !loading" class="welcome-page">
    <div class="welcome-container">
      <div class="welcome-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        全新版本
      </div>

      <h1 class="welcome-title">全能签安装指南</h1>
      <p class="welcome-subtitle">一键安装你的 iOS 应用，简单又快捷</p>

      <div class="welcome-features">
        <div class="feature-card">
          <div class="feature-icon feature-icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div class="feature-text">
            <strong>3分钟快速安装</strong>
            <span>不用电脑，手机直接搞定</span>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon feature-icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div class="feature-text">
            <strong>稳定签名</strong>
            <span>不掉签，长期使用</span>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon feature-icon-orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
          </div>
          <div class="feature-text">
            <strong>支持所有 iOS 设备</strong>
            <span>无需越狱</span>
          </div>
        </div>
      </div>

      <router-link to="/doc/全能签教程/安装教程.md" class="welcome-btn">
        立即开始安装
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </router-link>
    </div>
  </div>

  <DocContent v-if="!welcomeMode && doc" :doc="doc" />
  <div v-if="!loading && missing && !welcomeMode" class="doc-placeholder">
    尚未创建 README.md，请在 note 目录添加首页内容。
  </div>
</template>

<style scoped>
.welcome-page {
  min-height: calc(100vh - var(--header-height) - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(180deg, var(--color-primary-light) 0%, transparent 100%);
  border-radius: 16px;
  margin: 20px;
}

.welcome-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 16px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: var(--color-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  font-size: 18px;
  color: var(--color-text-secondary);
  margin: 0 0 40px;
  line-height: 1.6;
}

.welcome-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  background: var(--color-bg);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: var(--color-shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--color-shadow-md);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon-blue {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.feature-icon-green {
  background: #dcfce7;
  color: #10b981;
}

.feature-icon-orange {
  background: #fef3c7;
  color: #f59e0b;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-text strong {
  font-size: 14px;
  color: var(--color-text);
}

.feature-text span {
  font-size: 12px;
  color: var(--color-muted);
}

.welcome-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-gradient);
  color: white;
  padding: 16px 48px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  transition: all 0.2s;
}

.welcome-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.45);
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 32px;
  }

  .welcome-features {
    grid-template-columns: 1fr;
  }

  .welcome-page {
    margin: 0;
    border-radius: 0;
  }
}
</style>
