import { ref, watch, onMounted } from 'vue'

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 创建一个响应式的主题状态
export const theme = ref<Theme>('system')

// 当前实际应用的主题（light或dark）
export const currentTheme = ref<'light' | 'dark'>('light')

// 检测系统主题偏好
export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题到DOM
export function applyTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  currentTheme.value = theme
}

// 设置主题
export function setTheme(value: Theme) {
  theme.value = value
  
  // 保存到本地存储
  localStorage.setItem('theme', value)
  
  // 应用主题
  if (value === 'system') {
    applyTheme(getSystemTheme())
  } else {
    applyTheme(value)
  }
}

// 初始化主题
export function useTheme() {
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const updateTheme = () => {
    if (theme.value === 'system') {
      applyTheme(getSystemTheme())
    }
  }
  
  onMounted(() => {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('system')
    }
    
    // 监听系统主题变化
    mediaQuery.addEventListener('change', updateTheme)
  })
  
  // 监听主题变化
  watch(theme, (newTheme) => {
    setTheme(newTheme)
  })
  
  return {
    theme,
    currentTheme,
    setTheme
  }
} 