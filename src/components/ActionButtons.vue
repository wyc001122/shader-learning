<script lang="ts" setup>
import { Button } from '@/components/ui/button'

const props = defineProps<{
  activeShaderType?: string
}>()

const emit = defineEmits(['run', 'submit', 'reset'])

function runCode() {
  emit('run')
}

function submitCode() {
  emit('submit')
}

function resetCode() {
  emit('reset')
}
</script>

<template>
  <div class="action-buttons">
    <div class="flex justify-between mt-4">
      <div class="flex gap-2">
        <Button variant="outline" @click="runCode">
          <span class="truncate">运行代码</span>
        </Button>
        <Button @click="submitCode">
          <span class="truncate">提交</span>
        </Button>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" class=" text-muted-foreground hover:text-foreground" @click="resetCode">
          <span class="truncate">

            重置{{ activeShaderType === 'vertex' ? ' Vertex' : ' Fragment' }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-buttons {
  margin-top: 1rem;
}
</style> 