<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  type SidebarProps,
  SidebarRail,
} from '@/components/ui/sidebar'
import { GalleryVerticalEnd, Minus, Plus, CheckCircle } from 'lucide-vue-next'
import { toRawType } from '@vue/shared'

import menuData from "@/data/menu.json"
import { isTopicCompleted } from '@/utils/topicCompletionUtils'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'floating',
})
const data = ref<any>(menuData)

const route = useRoute()

// 强制刷新组件的标志
const refreshKey = ref(0)

// 监听题目完成事件
function setupTopicCompletedListener() {
  window.addEventListener('topic-completed', () => {
    // 增加刷新键，强制组件重新渲染
    refreshKey.value++
  })
}

// 滚动到活动菜单项
const scrollToActiveMenuItem = async () => {
  // 等待DOM更新
  await nextTick()

  // 查找带有 is-active 属性的菜单项
  const activeElement = document.querySelector('a[data-active="true"]')

  if (activeElement) {
    // 滚动到视图
    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // 添加一个临时的高亮效果
    activeElement.classList.add('highlight-active')
    setTimeout(() => {
      activeElement.classList.remove('highlight-active')
    }, 2000)
  }
}

const defaultOpen = ref()

function getDefaultOpen() {
  data.value.navMain.forEach((module: any, index: number) => {
    if (module.child && module.child.tasks && module.child.tasks.length) {
      const currentPath = route.path
      const moduleSlug = module.slug

      // 检查当前路径是否匹配此模块的任何任务
      if (module.child.tasks.some((task: any) => currentPath === `/${moduleSlug}/${task.slug}`)) {
        defaultOpen.value = index
      }
    }
  })
}

onBeforeMount(() => {
  getDefaultOpen()
})

onMounted(() => {
  if (toRawType(defaultOpen.value) === 'Number') {
    scrollToActiveMenuItem()
  }
  
  // 设置题目完成事件监听
  setupTopicCompletedListener()
})

onBeforeUnmount(() => {
  // 移除事件监听器
  window.removeEventListener('topic-completed', () => {})
})
</script>
<template>
  <Sidebar v-bind="props" :key="refreshKey">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <div>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <!-- <GalleryVerticalEnd class="size-4" /> -->
                <span class="text-xl">
                  🍊
                </span>
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Shader Learning</span>
                <span class="">v0.0.1</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <Collapsible v-for="(module, index) in data.navMain" :key="module.slug" :default-open="index === defaultOpen"
            class="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton>
                  {{ module.name }}
                  <Plus class="ml-auto group-data-[state=open]/collapsible:hidden" />
                  <Minus class="ml-auto group-data-[state=closed]/collapsible:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent v-if="module.child && module.child.tasks && module.child.tasks.length">
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="task in module.child.tasks" :key="task.slug">
                    <SidebarMenuSubButton as-child :is-active="route.path === `/${module.slug}/${task.slug}`">
                      <router-link :to="`/${module.slug}/${task.slug}`"
                        :data-active="route.path === `/${module.slug}/${task.slug}`"
                        class="flex items-center gap-2">
                        <!-- 完成状态标记 - 圆形绿色背景的对勾 -->
                        <div v-if="isTopicCompleted(module.slug, task.slug)" 
                          class="flex-shrink-0 w-4 h-4 rounded-full bg-[#4ca154] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
                            stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>{{ task.name }}</span>
                      </router-link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>