<script lang="ts" setup>
import { ref } from 'vue'

const info = inject('info') as Ref<any>
const taskDetail = inject('taskDetail') as Ref<any>

const activeTab = ref('task')

function getChannelImage(index: any) {
  return new URL(`../assets/channels/${info.value.collect.slug}_${info.value.topic.slug}_${index}.jpg`, import.meta.url).href
}

const tabs = ref([
  { label: '任务', value: 'task' },
  { label: '理论', value: 'theory' },
  { label: '答案', value: 'answer' }
])

</script>

<template>
  <div class="problem-content content-card">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-foreground truncate">{{ taskDetail.slug }}</h1>
    </div>

    <!-- tab标签页 -->
    <div class="flex mb-4">
      <button v-for="tab in tabs" :key="tab.value" class="px-4 py-2 text-sm font-medium"
        :class="activeTab === tab.value ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = tab.value">{{ tab.label }}</button>
    </div>

    <!-- 内容区 -->
    <div class="content-container">

      <!-- 任务 -->
      <div v-if="activeTab === 'task'" class="code-box text-foreground bg-muted p-4 rounded-lg markdown-content">
        <div v-html="taskDetail.task_description"></div>
        <div v-if="taskDetail.channels && taskDetail.channels.length" class="mt-4">
          <h3 class="font-medium mb-2">Textures:</h3>
          <div class="flex flex-wrap gap-4">
            <div v-for="channel in taskDetail.channels" :key="channel.index"
              class="shadow bg-card p-1 rounded-lg flex flex-col items-center gap-2">
              <img :src="getChannelImage(channel.index)" :alt="channel.index" v-viewer
                class="w-[100px] h-[100px] rounded-md object-contain" />
              <div class="font-medium">iChannel{{ channel.index }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 理论 -->
      <div v-else-if="activeTab === 'theory'" class="code-box text-foreground bg-muted p-4 rounded-lg markdown-content">
        <div v-html="taskDetail.theory_description" />
      </div>

      <!-- 答案 -->
      <div v-else-if="activeTab === 'answer'" class="flex flex-col gap-4">
        <div v-if="taskDetail.fragment_answer && taskDetail.fragmentCodeEditable">
          <div class="mb-2">fragment.glsl</div>
          <div class="bg-muted p-4 rounded-lg">
            <pre><code><div v-html="taskDetail.fragment_answer" class="w-full overflow-auto"/></code></pre>
          </div>
        </div>
        <div v-if="taskDetail.vertex_answer && taskDetail.vertexCodeEditable">
          <div class="mb-2">vertex.glsl</div>
          <div class="bg-muted p-4 rounded-lg">
            <pre><code><div v-html="taskDetail.vertex_answer" class="w-full overflow-auto"/></code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.problem-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-container {
  font-size: 14px;
  overflow-y: auto;
  flex: 1;
}

.content-card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>