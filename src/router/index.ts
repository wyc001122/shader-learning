import { createRouter, createWebHistory } from 'vue-router'
import menuData from '@/data/menu.json'

const children: any[] = []

menuData.navMain.forEach(module => {
    // 添加模块路由
    children.push({
        path: `/${module.slug}`,
        name: module.slug,
        redirect: `/${module.slug}/${module.child.tasks[0].slug}`,
    })

    // 添加任务路由
    if (module.child && module.child.tasks && module.child.tasks.length) {
        module.child.tasks.forEach(task => {
            children.push({
                path: `/${module.slug}/${task.slug}`,
                name: task.slug,
                component: () => import(`@/views/examples/index.vue`)
            })
        })
    }
})

// 路由配置
const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        redirect: children[0].path,
        children
    },
    // 添加404页面路由
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    },
    // 捕获所有未匹配的路由，重定向到404页面
    // {
    //     path: '/:catchAll(.*)',
    //     redirect: '/404'
    // }
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    next()
})

export default router 