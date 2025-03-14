<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  topicData: any
}>()
const activeTab = ref('task')

function getChannelImage(channel: any) {
  return new URL(`../assets/channels/${props.topicData.selectionName}_${props.topicData.slug}_${channel.index}.jpg`, import.meta.url).href
}
</script>

<template>
  <div class="problem-content content-card">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-foreground truncate">{{ topicData.name }}</h1>
    </div>

    <!-- 标签页 -->
    <div class="flex mb-4">
      <button class="px-4 py-2 text-sm font-medium"
        :class="activeTab === 'task' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'task'">
        任务
      </button>
      <button class="px-4 py-2 text-sm font-medium"
        :class="activeTab === 'theory' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'theory'">
        理论
      </button>
      <button class="px-4 py-2 text-sm font-medium"
        :class="activeTab === 'answer' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'answer'">
        答案
      </button>
    </div>

    <!-- 标签页内容 -->
    <div class="content-container">
      <div v-if="activeTab === 'task'" class="text-foreground bg-muted p-4 rounded-lg markdown-content">
        <div v-html="topicData.task"></div>
        <!-- 显示通道图片 -->
        <div v-if="topicData.channels && topicData.channels.length" class="mt-4">
          <h3 class="font-medium mb-2">Textures:</h3>
          <div class="flex flex-wrap gap-4">
            <div v-for="channel in topicData.channels" :key="channel.name"
              class="shadow bg-card p-1 rounded-lg flex flex-col items-center gap-2">
              <img :src="getChannelImage(channel)" :alt="channel.name" v-viewer
                class="w-[200px] h-[200px] rounded-md object-contain" />
              <div class="font-medium">iChannel{{ channel.index }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'theory'" class="text-foreground bg-muted p-4 rounded-lg markdown-content">
        <div v-html="topicData.theory"></div>
      </div>

      <div v-else-if="activeTab === 'answer'" class="flex flex-col gap-4">
        <div v-if="topicData.fragment_answer">
          <div class="mb-2">fragment.glsl</div>
          <div class="bg-muted p-4 rounded-lg">
            <pre><code><div v-html="topicData.fragment_answer"></div></code></pre>
          </div>
        </div>
        <div v-if="topicData.vertex_answer">
          <div class="mb-2">vertex.glsl</div>
          <div class="bg-muted p-4 rounded-lg">
            <pre><code><div v-html="topicData.vertex_answer"></div></code></pre>
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