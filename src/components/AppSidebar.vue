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
} from '@/components/ui/sidebar'
import { Minus, Plus, CircleCheck } from 'lucide-vue-next'
import { ANSWER_KEY } from '@/utils/locaAnswer'
import { useStorage } from '@vueuse/core'
import menuData from "@/data/menu.json"

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'floating',
})
const data = ref<any>(menuData)

const route = useRoute()

// 默认打开的模块
const info = inject('info') as Ref<any>

const local_answer = useStorage(ANSWER_KEY, {}) as Ref<any>

function isCompleted(collect_slug: string, topic_slug: string) {
  const answer_vertex = local_answer.value[`${collect_slug}_${topic_slug}_vertex`]
  const answer_fragment = local_answer.value[`${collect_slug}_${topic_slug}_fragment`]
  if (!answer_vertex || !answer_fragment) {
    return false
  }
  return true
}
watch(route, () => {
  nextTick(() => {
    scrollIntoCurrent()
  })
})

const reloadKey = ref(0)
function scrollIntoCurrent() {
  // 找到 a标签 且带有属性 data-sidebar='menu-sub-button' 且 data-active = true 的
  const target = document.querySelector('a[data-active=true]')
  if (!target) {
    reloadKey.value++
    return
  }
  // 监测taget是否在可视区域内
  const targetRect = target!.getBoundingClientRect()
  const isVisible = targetRect?.top < window.innerHeight && targetRect?.bottom > 0
  if (!isVisible) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}



onMounted(() => {
  scrollIntoCurrent()
})
</script>
<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <div>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
          <Collapsible v-for="(module) in data.navMain" :key="module.slug + reloadKey"
            :default-open="module.slug === info.collect?.slug" class="group/collapsible">
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
                    <SidebarMenuSubButton as-child :is-active="route.path === `/${module.slug}/${task.slug}`" :class="{
                      'data-[active=true]:bg-[#16a34a]/10': isCompleted(module.slug, task.slug),
                      'hover:bg-[#16a34a]/10': isCompleted(module.slug, task.slug)
                    }">
                      <router-link :to="`/${module.slug}/${task.slug}`"
                        :data-active="route.path === `/${module.slug}/${task.slug}`" class="flex items-center gap-2">
                        <CircleCheck class="w-4 h-4" style="color: #16a34a;"
                          v-if="isCompleted(module.slug, task.slug)" />
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