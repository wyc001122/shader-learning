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

const collectList = ref(menuData.navMain)

// 获取当前路由对应的菜单项
const info = computed(() => {
    const [collect_slug, topic_slug] = route.path.split('/').filter(Boolean)

    // 当前集合索引
    const collectIndex = collectList.value.findIndex((item: any) => item.slug === collect_slug)

    // 当前集合
    const collect = collectList.value[collectIndex] || null

    // 当前题目索引
    const topic_index = collect.child.tasks.findIndex((item: any) => item.slug === topic_slug);

    // 当前题目
    const topic = collect.child.tasks[topic_index] || null

    return { collect, topic, }
})
provide('info', info)

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
                        <BreadcrumbItem v-if="info.collect" class="hidden md:block">
                            <BreadcrumbLink :href="'#'">
                                {{ info.collect?.name || '' }}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator v-if="info.collect" class="hidden md:block" />
                        <BreadcrumbItem v-if="info.topic">
                            <BreadcrumbPage>{{ info.topic?.name || '' }}</BreadcrumbPage>
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
