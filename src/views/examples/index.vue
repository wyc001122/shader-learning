<script lang="ts" setup>
// 导入子组件
import MonacoEditor from '@/components/MonacoEditor.vue'
import ProblemContent from '@/components/ProblemContent.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import { comparePixelData } from '@/utils/comparePixelData'
import markdownit from 'markdown-it'
import hljs from "highlight.js"

// 导入服务
import ThreeCanvas from '@/components/ThreeCanvas.vue'

const md = markdownit({ html: true })
const info = inject('info') as Ref<any>
const taskDetail = computed(() => {
  const { topic } = info.value

  let fragment_answer = hljs.highlight(topic.child.task.fragmentShader, { language: 'glsl' }).value
  fragment_answer = fragment_answer.replace(/^[\s\n]+/, '')
  let vertex_answer = hljs.highlight(topic.child.task.vertexShader, { language: 'glsl' }).value
  vertex_answer = vertex_answer.replace(/^[\s\n]+/, '')

  let task_description = md.render(topic.child.task.description.split('### Task').filter(Boolean)[1] || '')
  let theory_description = md.render(topic.child.task.description.split('### Task').filter(Boolean)[0] || '')

  const _res: any = {
    ...topic,
    ...topic.child.task,
    fragment_answer,
    vertex_answer,
    task_description,
    theory_description,
  }

  delete _res.child

  return _res
})
provide('taskDetail', taskDetail)

// 用户编辑
const editForm = ref({
  vertexShader: '',
  fragmentShader: '',
})

// 当前编辑的着色器类型
const activeShaderTab = ref('fragment')

// 初始化任务数据
function initTaskData() {
  activeShaderTab.value = taskDetail.value.vertexCodeEditable ? 'vertex' : 'fragment'
  editForm.value.vertexShader = taskDetail.value.defaultVertexShader;
  editForm.value.fragmentShader = taskDetail.value.defaultFragmentShader;
}

// 运行
function handleRunCode(isSubmit = false) {
  canvasRef2.value?.updateMaterial(editForm.value.vertexShader, editForm.value.fragmentShader)
  if (isSubmit) {
    handleSubmitCode()
  }
}

// 提交
const canvasRef1 = ref<InstanceType<typeof ThreeCanvas> | null>(null)
const canvasRef2 = ref<InstanceType<typeof ThreeCanvas> | null>(null)
function handleSubmitCode() {
  const data1 = canvasRef1.value?.getPixelData();
  const data2 = canvasRef2.value?.getPixelData();
  comparePixelData(data1, data2);
}
// 重置
function handleResetCode() {
  if (activeShaderTab.value === 'fragment') {
    editForm.value.fragmentShader = taskDetail.value.defaultFragmentShader
  } else {
    editForm.value.vertexShader = taskDetail.value.defaultVertexShader
  }
  handleRunCode()
}

// 初始化数据
initTaskData()

</script>

<template>
  <div class="shader-problem-container">
    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full lg:overflow-hidden " v-if="taskDetail">
      <!-- 左侧题目区域 -->
      <div class="flex flex-col lg:col-span-5 bg-card h-[500px] lg:h-full overflow-y-auto">
        <ProblemContent />
      </div>
      <!-- 右侧代码和输出区域 -->
      <div class="lg:col-span-7 flex flex-col bg-background h-full lg:overflow-y-auto">
        <!-- 代码编辑区域 -->
        <div class="h-full flex-1 bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col">
          <!-- 顶部区域：着色器类型切换标签 -->
          <div class="flex mb-4">
            <button class="px-4 py-2 text-sm font-medium truncate" v-if="taskDetail?.vertexCodeEditable"
              :class="activeShaderTab === 'vertex' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="activeShaderTab = 'vertex'">
              vertex.glsl
            </button>
            <button class="px-4 py-2 text-sm font-medium truncate" v-if="taskDetail?.fragmentCodeEditable"
              :class="activeShaderTab === 'fragment' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="activeShaderTab = 'fragment'">
              fragment.glsl
            </button>
          </div>

          <!-- 中间区域：代码编辑器 -->
          <div
            class="bg-white rounded-md font-mono text-sm overflow-auto flex-1 transition-all duration-300 min-h-[150px]">
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
                  <div class="h-36 rounded-md overflow-hidden">
                    <ThreeCanvas ref="canvasRef1" :vertex-shader="taskDetail?.vertexShader || ''"
                      :fragment-shader="taskDetail?.fragmentShader || ''" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium mb-2 text-foreground truncate">实际输出</div>
                  <div class="h-36 rounded-md overflow-hidden">
                    <ThreeCanvas ref="canvasRef2" :vertex-shader="editForm?.vertexShader || ''"
                      :fragment-shader="editForm?.fragmentShader || ''" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <ActionButtons :active-shader-type="activeShaderTab" @run="handleRunCode" @reset="handleResetCode"
              @run-and-submit="() => handleRunCode(true)" />
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
  position: relative;
  /* 添加相对定位 */
}

/* 消息提示样式 */
.feedback-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  max-width: 450px;
  width: calc(100% - 32px);

  &.success {
    background-color: hsl(var(--background));
    border: 1px solid rgba(76, 161, 84, 0.2);
    color: hsl(var(--foreground));

    .icon {
      color: #4ca154;
    }

    .message-title {
      color: #4ca154;
    }
  }

  &.error {
    background-color: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    color: hsl(var(--foreground));

    .icon {
      color: hsl(var(--destructive));
    }

    .message-title {
      color: hsl(var(--destructive));
    }
  }

  .icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .message-content {
    flex: 1;
  }

  .message-title {
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 4px 0;
  }

  .message-description {
    font-size: 14px;
    margin: 0;
    color: hsl(var(--muted-foreground));
    line-height: 1.5;
  }

  .close-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: hsl(var(--muted-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    flex-shrink: 0;

    &:hover {
      color: hsl(var(--foreground));
    }
  }
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 模态框动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 成功弹窗样式 */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(4px);
}

.success-modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  text-align: center;
  position: relative;
}

.success-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
  padding-top: 40px;
  margin-bottom: 10px;
}

.success-message {
  padding: 0 20px 20px;
  color: #666;
  font-size: 16px;
}

.success-divider {
  height: 1px;
  background-color: #eee;
  width: 100%;
}

.success-actions {
  display: flex;
  padding: 15px;
}

.btn-next,
.btn-close {
  flex: 1;
  padding: 12px 0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-next {
  background-color: #4ca154;
  color: white;
  border: none;
  margin-right: 10px;
}

.btn-next:hover {
  background-color: #3d8a44;
}

.btn-close {
  background-color: #f5f5f5;
  color: #666;
  border: none;
}

@media (max-width: 1023px) {
  .shader-problem-container {
    height: auto;
    min-height: calc(100vh - 64px);
    overflow-y: auto;
    padding-bottom: 0.6rem;
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

/* 添加菜单项高亮动画效果 */
.highlight-active {
  animation: pulse-highlight 2s ease-in-out;
}

@keyframes pulse-highlight {
  0% {
    background-color: transparent;
  }

  30% {
    background-color: rgba(76, 161, 84, 0.1);
  }

  100% {
    background-color: transparent;
  }
}

.output-preview {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* 加载遮罩样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsl(var(--background) / 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: hsl(var(--card));
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid hsl(var(--border));
  min-width: 280px;
  position: relative;
  overflow: hidden;
  animation: slide-up 0.4s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 顶部装饰线 */
.top-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #4ca154, #85ce93, #4ca154);
  background-size: 200% 100%;
  animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* 新的加载动画样式 */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px 0 24px;
}

.circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #4ca154;
  animation: bounce 1.2s infinite ease-in-out both;
  box-shadow: 0 0 10px rgba(76, 161, 84, 0.5);
}

.circle:nth-child(1) {
  animation-delay: -0.3s;
  background-color: #4ca154;
}

.circle:nth-child(2) {
  animation-delay: -0.15s;
  background-color: #5fb069;
}

.circle:nth-child(3) {
  animation-delay: 0s;
  background-color: #72bf7e;
}

.circle:nth-child(4) {
  animation-delay: 0.15s;
  background-color: #85ce93;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 进度条效果 */
.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(76, 161, 84, 0.1);
  border-radius: 2px;
  margin-top: 16px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #4ca154;
  width: 30%;
  border-radius: 2px;
  animation: progress 5s ease-in-out infinite;
  position: relative;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes progress {
  0% {
    width: 0%;
    opacity: 1;
  }

  50% {
    width: 70%;
    opacity: 0.8;
  }

  100% {
    width: 100%;
    opacity: 0.6;
  }
}

.loading-text {
  text-align: center;

  .loading-title {
    display: block;
    font-weight: 600;
    font-size: 18px;
    color: hsl(var(--foreground));
    margin-bottom: 8px;
  }

  .loading-description {
    display: block;
    font-size: 14px;
    color: hsl(var(--muted-foreground));
  }
}


@keyframes icon-appear {
  0% {
    transform: scale(0) rotate(-90deg);
    opacity: 0;
  }

  70% {
    transform: scale(1.2) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
</style>

<!-- 全局样式 -->
<style lang="scss">
/* 添加菜单项高亮动画效果 */
.highlight-active {
  animation: pulse-highlight 2s ease-in-out;
}

@keyframes pulse-highlight {
  0% {
    background-color: transparent;
  }

  30% {
    background-color: rgba(76, 161, 84, 0.1);
  }

  100% {
    background-color: transparent;
  }
}
</style>
