import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);

  // 全局 API 地址
  app.config.globalProperties.$apiBase = 'http://localhost:3000';

  return { app, pinia };
}
