<script lang="ts">
export const iframeHeight = '800px'
export const description = 'A floating sidebar with submenus.'
</script>
<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import menuData from '@/data/menu.json'

const route = useRoute()

// 获取当前路由对应的菜单项
const currentMenuInfo = computed(() => {
    const path = route.path
    const [collectSlug, topicSlug] = path.split('/').filter(Boolean)

    // 查找当前集合
    const currentCollect = menuData.navMain.find(item => item.slug === collectSlug) || null

    // 查找当前主题
    let currentTopic = null
    if (currentCollect && currentCollect.child && currentCollect.child.tasks && topicSlug) {
        currentTopic = currentCollect.child.tasks.find((task: any) => task.slug === topicSlug) || null
    }

    return {
        collect: currentCollect,
        topic: currentTopic
    }
})

const reloadKey = ref(0)
watch(route, () => reloadKey.value++)
</script>
<template>
    <SidebarProvider :style="{ '--sidebar-width': '20rem' }">
        <AppSidebar />
        <SidebarInset class="h-screen overflow-hidden flex flex-col">
            <header class="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem v-if="currentMenuInfo.collect" class="hidden md:block">
                            <BreadcrumbLink :href="'#'">
                                {{ currentMenuInfo.collect?.name || '' }}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator v-if="currentMenuInfo.collect" class="hidden md:block" />
                        <BreadcrumbItem v-if="currentMenuInfo.topic">
                            <BreadcrumbPage>{{ currentMenuInfo.topic?.name || '' }}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb> 
            </header>
            <div class="flex flex-1 flex-col gap-4 p-2 pt-0 overflow-hidden">
                <router-view :key="reloadKey" />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
