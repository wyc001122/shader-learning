<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Play, CheckCircle, RotateCcw } from 'lucide-vue-next'

defineProps<{
  activeShaderType?: string,
  isSubmitting?: boolean
}>()

const emit = defineEmits(['run', 'reset', 'runAndSubmit'])

function runCode() {
  emit('run')
}

function runAndSubmitCode() {
  emit('runAndSubmit')
}

function resetCode() {
  emit('reset')
}
</script>

<template>
  <div class="action-buttons">
    <div class="flex justify-between mt-4">
      <div class="flex gap-2">
        <Button variant="outline" @click="runCode" class="gap-2">
          <Play class="h-4 w-4" />
          <span class="truncate">运行</span>
        </Button>
        <Button @click="runAndSubmitCode" class="gap-2">
          <CheckCircle class="h-4 w-4" />
          <span class="truncate">运行并提交</span>
        </Button>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-foreground gap-1" @click="resetCode">
          <RotateCcw class="h-3.5 w-3.5" />
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