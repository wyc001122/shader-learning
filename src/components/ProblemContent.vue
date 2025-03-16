<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isTopicCompleted } from '@/utils/topicCompletionUtils'
import { getTopicData } from '@/services/topicService'
import menuData from '@/data/menu.json'

const props = defineProps<{
  topicData: any
}>()
const activeTab = ref('task')
const router = useRouter()
const route = useRoute()

// 获取当前路径信息
const [collectSlug, topicSlug] = route.path.split('/').filter(Boolean)

// 获取当前集合数据
const { collectData } = getTopicData(collectSlug, topicSlug)

// 获取所有集合数据
const allCollections = computed(() => {
  return menuData.navMain || []
})

// 计算当前集合在所有集合中的索引
const currentCollectionIndex = computed(() => {
  return allCollections.value.findIndex((collection: any) => collection.slug === collectSlug)
})

// 计算上一个集合
const prevCollection = computed(() => {
  if (currentCollectionIndex.value <= 0) return null
  return allCollections.value[currentCollectionIndex.value - 1]
})

// 计算下一个集合
const nextCollection = computed(() => {
  if (currentCollectionIndex.value === -1 || currentCollectionIndex.value >= allCollections.value.length - 1) return null
  return allCollections.value[currentCollectionIndex.value + 1]
})

// 计算属性：获取当前集合中的所有题目
const currentCollectionTopics = computed(() => {
  if (!collectData || !collectData.child || !collectData.child.tasks) {
    return []
  }
  return collectData.child.tasks
})

// 计算属性：当前题目在集合中的索引
const currentTopicIndex = computed(() => {
  return currentCollectionTopics.value.findIndex((topic: any) => topic.slug === topicSlug)
})

// 计算属性：上一题
const prevTopic = computed(() => {
  // 如果当前不是第一题，返回当前集合的上一题
  if (currentTopicIndex.value > 0) {
    return {
      topic: currentCollectionTopics.value[currentTopicIndex.value - 1],
      collection: collectData
    }
  } 
  // 如果是第一题且有上一个集合，返回上一个集合的最后一题
  else if (prevCollection.value) {
    try {
      const prevCollectionData = getTopicData(prevCollection.value.slug, '').collectData
      if (prevCollectionData && prevCollectionData.child && prevCollectionData.child.tasks && prevCollectionData.child.tasks.length > 0) {
        const lastTopic = prevCollectionData.child.tasks[prevCollectionData.child.tasks.length - 1]
        return {
          topic: lastTopic,
          collection: prevCollectionData
        }
      }
    } catch (e) {
      console.error('获取上一个集合数据失败', e)
    }
  }
  return null
})

// 计算属性：下一题
const nextTopic = computed(() => {
  // 如果当前不是最后一题，返回当前集合的下一题
  if (currentTopicIndex.value !== -1 && currentTopicIndex.value < currentCollectionTopics.value.length - 1) {
    return {
      topic: currentCollectionTopics.value[currentTopicIndex.value + 1],
      collection: collectData
    }
  } 
  // 如果是最后一题且有下一个集合，返回下一个集合的第一题
  else if (nextCollection.value) {
    try {
      const nextCollectionData = getTopicData(nextCollection.value.slug, '').collectData
      if (nextCollectionData && nextCollectionData.child && nextCollectionData.child.tasks && nextCollectionData.child.tasks.length > 0) {
        const firstTopic = nextCollectionData.child.tasks[0]
        return {
          topic: firstTopic,
          collection: nextCollectionData
        }
      }
    } catch (e) {
      console.error('获取下一个集合数据失败', e)
    }
  }
  return null
})

// 导航到上一题
function goToPrevTopic() {
  if (prevTopic.value && prevTopic.value.collection && prevTopic.value.topic) {
    router.push(`/${prevTopic.value.collection.slug}/${prevTopic.value.topic.slug}`)
  }
}

// 导航到下一题
function goToNextTopic() {
  if (nextTopic.value && nextTopic.value.collection && nextTopic.value.topic) {
    router.push(`/${nextTopic.value.collection.slug}/${nextTopic.value.topic.slug}`)
  }
}

function getChannelImage(channel: any) {
  return new URL(`../assets/channels/${props.topicData.selectionName}_${props.topicData.slug}_${channel.index}.jpg`, import.meta.url).href
}
</script>

<template>
  <div class="problem-content content-card">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-foreground truncate">{{ topicData.name }}</h1>
    </div>

    <!-- 导航按钮 -->
    <div class="topic-navigation mb-4 flex items-center justify-between">
      <button 
        @click="goToPrevTopic" 
        :disabled="!prevTopic"
        class="nav-button prev-button" 
        :class="{'disabled': !prevTopic}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span v-if="prevTopic && prevTopic.topic && prevTopic.collection" class="flex items-center text-xs">
          <!-- 已完成标记 -->
          <span v-if="prevTopic.topic && prevTopic.collection && isTopicCompleted(prevTopic.collection.slug, prevTopic.topic.slug)" class="completed-icon mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span v-if="prevTopic.collection && prevTopic.collection.slug !== collectSlug" class="collection-indicator mr-1">
            {{ prevTopic.collection.name }}:
          </span>
          {{ prevTopic.topic.name }}
        </span>
        <span v-else class="text-xs">没有上一题</span>
      </button>
      
      <button 
        @click="goToNextTopic" 
        :disabled="!nextTopic"
        class="nav-button next-button" 
        :class="{'disabled': !nextTopic}">
        <span v-if="nextTopic && nextTopic.topic && nextTopic.collection" class="flex items-center text-xs">
          <!-- 已完成标记 -->
          <span v-if="nextTopic.topic && nextTopic.collection && isTopicCompleted(nextTopic.collection.slug, nextTopic.topic.slug)" class="completed-icon mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span v-if="nextTopic.collection && nextTopic.collection.slug !== collectSlug" class="collection-indicator mr-1">
            {{ nextTopic.collection.name }}:
          </span>
          {{ nextTopic.topic.name }}
        </span>
        <span v-else class="text-xs">没有下一题</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
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
      <div v-if="activeTab === 'task'" class="code-box text-foreground bg-muted p-4 rounded-lg markdown-content">
        <div v-html="topicData.task"></div>
        <!-- 显示通道图片 -->
        <div v-if="topicData.channels && topicData.channels.length" class="mt-4">
          <h3 class="font-medium mb-2">Textures:</h3>
          <div class="flex flex-wrap gap-4">
            <div v-for="channel in topicData.channels" :key="channel.name"
              class="shadow bg-card p-1 rounded-lg flex flex-col items-center gap-2">
              <img :src="getChannelImage(channel)" :alt="channel.name" v-viewer
                class="w-[100px] h-[100px] rounded-md object-contain" />
              <div class="font-medium">iChannel{{ channel.index }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'theory'" class="code-box text-foreground bg-muted p-4 rounded-lg markdown-content">
        <div v-html="topicData.theory"></div>
      </div>

      <div v-else-if="activeTab === 'answer'" class="flex flex-col gap-4">
        <div v-if="topicData.fragment_answer && topicData.fragmentCodeEditable">
          <div class="mb-2">fragment.glsl</div>
          <div class="bg-muted p-4 rounded-lg">
            <pre><code><div v-html="topicData.fragment_answer" class="w-full overflow-auto"></div></code></pre>
          </div>
        </div>
        <div v-if="topicData.vertex_answer && topicData.vertexCodeEditable">
          <div class="mb-2">vertex.glsl</div>
          <div class="bg-muted p-4 rounded-lg">
            <pre><code><div v-html="topicData.vertex_answer" class="w-full overflow-auto"></div></code></pre>
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

/* 导航按钮样式 */
.topic-navigation {
  border-radius: 0.5rem;
  background-color: hsl(var(--muted));
  padding: 0.375rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  transition: all 0.2s ease;
  max-width: 45%;
}

.nav-button span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-button:hover:not(.disabled) {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-button {
  padding-left: 0.375rem;
}

.next-button {
  padding-right: 0.375rem;
}

/* 为已完成的题目添加标记 */
.nav-button .completed-icon {
  color: #4ca154;
  margin-right: 0.25rem;
  flex-shrink: 0;
}

/* 集合指示器样式 */
.collection-indicator {
  color: hsl(var(--primary));
  font-weight: 600;
  flex-shrink: 0;
}
</style>