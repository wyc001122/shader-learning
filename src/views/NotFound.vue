<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4">
    <div class="flex flex-col items-center text-center space-y-6 max-w-md">
      <div class="rounded-full bg-muted p-6 flex items-center justify-center">
        <AlertCircle class="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 class="text-4xl font-bold tracking-tight">404</h1>
      <h2 class="text-2xl font-semibold tracking-tight">页面未找到</h2>
      <p class="text-muted-foreground">
        抱歉，您尝试访问的页面不存在或已被移除。
      </p>
      <div class="flex flex-col sm:flex-row gap-2 mt-2">
        <Button @click="goBack" variant="outline" class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          返回上一页
        </Button>
        <Button @click="goHome" class="gap-2">
          <Home class="h-4 w-4" />
          返回首页
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, ArrowLeft, Home } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script> 