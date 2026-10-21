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
  <DocContent v-if="doc" :doc="doc" />
  <div v-if="!loading && missing" class="doc-placeholder">
    尚未创建 README.md，请在 note 目录添加首页内容。
  </div>
</template>
