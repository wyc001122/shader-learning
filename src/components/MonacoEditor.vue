<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { language } from "@/views/examples/glsl"
import '@/views/examples/userWorker'
import { useResizeObserver } from '@vueuse/core'

const props = defineProps<{
  value: string
  language?: string
}>()

const emit = defineEmits(['update:value'])

let editor: any = null
const editorContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!editorContainer.value) return

  monaco.languages.register({ id: 'glsl' })
  monaco.languages.setMonarchTokensProvider('glsl', language)

  editor = monaco.editor.create(editorContainer.value, {
    value: props.value,
    language: props.language || 'glsl',
  })

  editor.onDidChangeModelContent(() => {
    emit('update:value', editor.getValue())
  })
})

useResizeObserver(editorContainer, (entries) => {
  if (entries.length) {
    resizeEditor()
  }
})


onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }

})

watch(() => props.value, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})

function resizeEditor() {
  if (editor) {
    editor.layout()
  }
}
</script>

<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>