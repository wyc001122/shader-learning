import { createApp } from 'vue'
import './assets/index.css'
import router from './router'
import App from './App.vue'
import 'highlight.js/styles/github.css'  // 改为 GitHub 风格
import './assets/markdown.css'  // 引入 Markdown 样式
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

// 初始化主题
import { getSystemTheme, applyTheme } from './lib/theme'


// 在应用挂载前应用主题，避免闪烁
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  applyTheme('dark')
} else if (savedTheme === 'light') {
  applyTheme('light')
} else {
  // 默认跟随系统
  applyTheme(getSystemTheme())
}

const app = createApp(App)

app.use(router)
app.use(VueViewer, {
  defaultOptions: {
    zIndex: 9999,
    toolbar: false, 
  }
})

app.mount('#app')
