import { createApp } from 'vue'
import './assets/index.css'
import router from './router'
import App from './App.vue'
import 'highlight.js/styles/github.css'  // 改为 GitHub 风格
import './assets/markdown.scss'  // 引入 Markdown 样式
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';


const app = createApp(App)

app.use(router)
app.use(VueViewer, {
  defaultOptions: {
    zIndex: 9999,
    toolbar: false, 
  }
})

app.mount('#app')
