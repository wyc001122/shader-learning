<script lang="ts" setup>
import { useRoute } from 'vue-router'

// 导入子组件
import MonacoEditor from '@/components/MonacoEditor.vue'
import ProblemContent from '@/components/ProblemContent.vue'
import ActionButtons from '@/components/ActionButtons.vue'

// 导入服务
import { getTopicData } from '@/services/topicService'
import type { TopicData } from '@/services/topicService'

const route = useRoute()
const [collectSlug, topicSlug] = route.path.split('/').filter(Boolean)

// 数据状态
const currentTopicData = ref<TopicData | null>(null)
const editForm = ref({
  vertexShader: '',
  fragmentShader: '',
})

// 当前编辑的着色器类型
const activeShaderTab = ref('fragment')

// 初始化数据
onMounted(() => {
  loadTopicData()
})

// 加载主题数据 
function loadTopicData() {
  const { topicData } = getTopicData(collectSlug, topicSlug)

  if (topicData) {
    currentTopicData.value = topicData
    editForm.value.vertexShader = topicData.defaultVertexShader
    editForm.value.fragmentShader = topicData.defaultFragmentShader
  } else {
    console.error('有问题 反馈给🍊')
  }
}

// 运行
function handleRunCode() {
  console.log(editForm.value.fragmentShader)
}

// 提交
function handleSubmitCode() {
}

// 重置
function handleResetCode() {
  if (currentTopicData.value) {
    if (activeShaderTab.value === 'fragment') {
      editForm.value.fragmentShader = currentTopicData.value.defaultFragmentShader
    } else {
      editForm.value.vertexShader = currentTopicData.value.defaultVertexShader
    }
  }
}
</script>

<template>
  <div class="shader-problem-container">
    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full lg:overflow-hidden ">
      <!-- 左侧题目区域 -->
      <div class="flex flex-col lg:col-span-5 bg-card h-[400px] lg:h-full overflow-y-auto">
        <ProblemContent v-if="currentTopicData" :topicData="currentTopicData" />
      </div>

      <!-- 右侧代码和输出区域 -->
      <div class="lg:col-span-7 flex flex-col bg-background h-full lg:overflow-y-auto">
        <!-- 代码编辑区域 -->
        <div class="flex-1 bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col">
          <!-- 顶部区域：着色器类型切换标签 -->
          <div class="flex mb-4">
            <button class="px-4 py-2 text-sm font-medium truncate"
              :class="activeShaderTab === 'vertex' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="activeShaderTab = 'vertex'">
              vertex.glsl
            </button>
            <button class="px-4 py-2 text-sm font-medium truncate"
              :class="activeShaderTab === 'fragment' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="activeShaderTab = 'fragment'">
              fragment.glsl
            </button>
          </div>

          <!-- 中间区域：代码编辑器 -->
          <div
            class="bg-white rounded-md font-mono text-sm overflow-auto flex-1 transition-all duration-300 min-h-[200px]">
            <div class="flex w-full h-full rounded-md overflow-hidden">
              <MonacoEditor v-if="activeShaderTab === 'fragment'" v-model:value="editForm.fragmentShader"
                language="glsl" />
              <MonacoEditor v-else v-model:value="editForm.vertexShader" language="glsl" />
            </div>
          </div>

          <!-- 底部区域：输出预览和操作按钮 -->
          <div class="mt-auto">
            <!-- 输出区域 -->
            <div class="output-preview">
              <div class="flex gap-4">
                <div class="flex-1">
                  <div class="text-sm font-medium mb-2 text-foreground truncate">预期输出</div>
                  <div class="bg-yellow-300 h-36 rounded-md"></div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium mb-2 text-foreground truncate">实际输出</div>
                  <div class="bg-yellow-300 h-36 rounded-md"></div>
                </div>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <ActionButtons :active-shader-type="activeShaderTab" @run="handleRunCode" @submit="handleSubmitCode"
              @reset="handleResetCode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shader-problem-container {
  height: calc(100vh - 64px);
  background-color: hsl(var(--background));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 1023px) {
  .shader-problem-container {
    height: auto;
    min-height: calc(100vh - 64px);
    overflow-y: auto;
    padding-bottom: 2rem;
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .flex-col {
    min-height: 0;
  }
}

.output-preview {
  margin-top: 1rem;
}
</style>
