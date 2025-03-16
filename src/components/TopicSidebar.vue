<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isTopicCompleted, getCollectionProgress } from '@/utils/topicCompletionUtils';

// 定义属性
const props = defineProps<{
  collection: {
    slug: string;
    title: string;
    description?: string;
    topics: {
      slug: string;
      title: string;
      difficulty?: 'easy' | 'medium' | 'hard';
    }[];
  }
}>();

const router = useRouter();
const route = useRoute();

// 当前选中的题目
const currentTopicSlug = computed(() => {
  const paths = route.path.split('/').filter(Boolean);
  return paths.length > 1 ? paths[1] : '';
});

// 计算集合的完成进度
const collectionProgress = computed(() => {
  return getCollectionProgress(props.collection.slug, props.collection.topics.length);
});

// 导航到题目
function navigateToTopic(topicSlug: string) {
  router.push(`/${props.collection.slug}/${topicSlug}`);
}

// 检查题目是否已完成
function checkTopicCompleted(topicSlug: string): boolean {
  return isTopicCompleted(props.collection.slug, topicSlug);
}
</script>

<template>
  <div class="topic-sidebar">
    <!-- 集合标题和进度 -->
    <div class="collection-header">
      <h2 class="collection-title">{{ collection.title }}</h2>
      <p v-if="collection.description" class="collection-description">{{ collection.description }}</p>
      
      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${collectionProgress}%` }"></div>
        </div>
        <span class="progress-text">{{ collectionProgress }}% 完成</span>
      </div>
    </div>
    
    <!-- 题目列表 -->
    <div class="topic-list">
      <div v-for="topic in collection.topics" :key="topic.slug" 
           class="topic-item" 
           :class="{ 
             'active': topic.slug === currentTopicSlug,
             'completed': checkTopicCompleted(topic.slug)
           }"
           @click="navigateToTopic(topic.slug)">
        
        <div class="topic-info">
          <span class="topic-title">{{ topic.title }}</span>
          <span v-if="topic.difficulty" class="topic-difficulty" :class="topic.difficulty">
            {{ {'easy': '简单', 'medium': '中等', 'hard': '困难'}[topic.difficulty] }}
          </span>
        </div>
        
        <!-- 完成状态图标 -->
        <div v-if="checkTopicCompleted(topic.slug)" class="completion-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topic-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: hsl(var(--card));
  border-right: 1px solid hsl(var(--border));
}

.collection-header {
  padding: 16px;
  border-bottom: 1px solid hsl(var(--border));
}

.collection-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: hsl(var(--foreground));
}

.collection-description {
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: hsl(var(--muted) / 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4ca154;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
}

.topic-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.topic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: hsl(var(--accent) / 0.1);
  }
  
  &.active {
    background-color: hsl(var(--accent) / 0.2);
    font-weight: 500;
  }
  
  &.completed {
    .topic-title {
      color: #4ca154;
    }
  }
}

.topic-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.topic-title {
  font-size: 14px;
  color: hsl(var(--foreground));
}

.topic-difficulty {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
  
  &.easy {
    background-color: hsl(142, 76%, 36%, 0.1);
    color: hsl(142, 76%, 36%);
  }
  
  &.medium {
    background-color: hsl(48, 96%, 53%, 0.1);
    color: hsl(38, 92%, 50%);
  }
  
  &.hard {
    background-color: hsl(0, 84%, 60%, 0.1);
    color: hsl(0, 84%, 60%);
  }
}

.completion-icon {
  color: #4ca154;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 