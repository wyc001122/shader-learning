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

// 添加状态管理
const feedbackMessage = ref({
  show: false,
  message: '',
})

// 添加成功弹窗状态
const successDialog = ref({
  show: false,
  message: '',
})

// 添加加载状态
const isSubmitting = ref(false)

// 提交
const canvasRef1 = ref<InstanceType<typeof ThreeCanvas> | null>(null)
const canvasRef2 = ref<InstanceType<typeof ThreeCanvas> | null>(null)

// 用于清除定时器
let frameCheckIntervalId: number | undefined = undefined

function handleSubmitCode() {
  // 设置加载状态
  isSubmitting.value = true;
  
  // 对于动画着色器，需要连续判断多帧
  const totalFrames = 30; // 判断30帧
  let matchedFrames = 0;
  let currentFrame = 0;
  let hasFailure = false; // 标记是否有不匹配的帧

  // 清除之前可能存在的间隔定时器
  if (frameCheckIntervalId !== undefined) {
    clearInterval(frameCheckIntervalId);
  }

  // 开始帧检查
  frameCheckIntervalId = setInterval(() => {
    // 如果已经发现不匹配，不再继续检查
    if (hasFailure) {
      return;
    }

    // 获取并比较像素数据
    const data1 = canvasRef1.value?.getPixelData();
    const data2 = canvasRef2.value?.getPixelData();
    const frameMatches = comparePixelData(data1, data2);

    if (frameMatches) {
      matchedFrames++;
    } else {
      // 发现不匹配的帧，标记失败
      hasFailure = true;
      clearInterval(frameCheckIntervalId);
      frameCheckIntervalId = undefined;
      
      // 关闭加载状态
      isSubmitting.value = false;
      
      // 显示失败消息
      feedbackMessage.value = {
        show: true,
        message: '失败，你的着色器实现与预期不一致，请检查并修改。'
      };
      
      // 3秒后自动隐藏失败消息
      setTimeout(() => {
        feedbackMessage.value.show = false;
      }, 3000);
      
      return;
    }

    currentFrame++;

    // 检查是否已完成所有帧的检查
    if (currentFrame >= totalFrames) {
      clearInterval(frameCheckIntervalId);
      frameCheckIntervalId = undefined;
      
      // 关闭加载状态
      isSubmitting.value = false;
      
      // 显示成功弹窗
      successDialog.value = {
        show: true,
        message: '恭喜！提交成功！你的着色器实现与预期一致。'
      };
      
      // TODO: 保存用户答案和更新完成状态的逻辑
    }
  }, 100); // 每100ms检查一次
}

// 关闭成功弹窗
function closeSuccessDialog() {
  successDialog.value.show = false;
}

// 前往下一题
function goToNextTopic() {
  // TODO: 实现导航到下一题的逻辑
  closeSuccessDialog();
}

// 组件卸载时清理资源
onUnmounted(() => {
  // 清除帧检查间隔定时器
  if (frameCheckIntervalId !== undefined) {
    clearInterval(frameCheckIntervalId);
    frameCheckIntervalId = undefined;
  }
  
  // 确保状态被重置
  isSubmitting.value = false;
  feedbackMessage.value.show = false;
  successDialog.value.show = false;
});

// 运行
function handleRunCode(isSubmit = false) {
  canvasRef2.value?.updateMaterial(editForm.value.vertexShader, editForm.value.fragmentShader)
  if (isSubmit) {
    handleSubmitCode()
  }
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
    <!-- 失败消息提示 -->
    <Transition name="fade">
      <div v-if="feedbackMessage.show" class="feedback-message">
        <div class="feedback-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div class="feedback-content">
          <p>{{ feedbackMessage.message }}</p>
        </div>
        <button class="feedback-close" @click="feedbackMessage.show = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- 成功弹窗 -->
    <Transition name="dialog-fade">
      <div v-if="successDialog.show" class="success-dialog-overlay">
        <div class="success-dialog">
          <h3 class="success-title">提交成功</h3>
          <div class="success-body">
            <p>{{ successDialog.message }}</p>
          </div>
          <div class="success-divider"></div>
          <div class="success-actions">
            <button class="btn-next" @click="goToNextTopic">下一题</button>
            <button class="btn-close" @click="closeSuccessDialog">关闭</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 加载遮罩 -->
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner">
        <div class="top-line"></div>
        <div class="loader">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
        <div class="loading-text">
          <span class="loading-title">正在验证着色器</span>
          <span class="loading-description">请稍候，正在对比多帧渲染结果...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>

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
              @run-and-submit="() => handleRunCode(true)" :is-submitting="isSubmitting" />
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

/* 失败消息提示样式 */
.feedback-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ce364c;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  max-width: 450px;
  width: calc(100% - 32px);
  
  .feedback-icon {
    flex-shrink: 0;
    color: #ce364c;
  }
  
  .feedback-content {
    flex: 1;
    p {
      margin: 0;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  .feedback-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
    
    &:hover {
      color: #333;
    }
  }
}

/* 成功弹窗样式 */
.success-dialog-overlay {
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

.success-dialog {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.success-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #4ca154;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(76, 161, 84, 0.3);
}

.success-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
  padding-top: 50px;
  margin-bottom: 10px;
}

.success-body {
  padding: 0 20px 20px;
  color: #666;
  font-size: 16px;
  
  p {
    margin: 0;
    line-height: 1.5;
  }
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

.btn-next, .btn-close {
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
  
  &:hover {
    background-color: #3d8a44;
  }
}

.btn-close {
  background-color: #f5f5f5;
  color: #666;
  border: none;
  
  &:hover {
    background-color: #e8e8e8;
  }
}

/* 动画效果 */
.fade-enter-active, 
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, 
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .success-dialog,
.dialog-fade-leave-active .success-dialog {
  transition: transform 0.3s;
}

.dialog-fade-enter-from .success-dialog,
.dialog-fade-leave-to .success-dialog {
  transform: scale(0.95);
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

.output-preview {
  margin-top: 1rem;
  margin-bottom: 1rem;
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
