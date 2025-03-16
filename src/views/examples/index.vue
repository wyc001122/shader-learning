<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import * as THREE from 'three'
// 导入子组件
import MonacoEditor from '@/components/MonacoEditor.vue'
import ProblemContent from '@/components/ProblemContent.vue'
import ActionButtons from '@/components/ActionButtons.vue'

// 导入服务
import { getTopicData } from '@/services/topicService'
import type { TopicData } from '@/services/topicService'
import ThreeCanvas from '@/components/ThreeCanvas.vue'
import type { SceneSettings } from '@/hooks/useThree'
import { isTopicCompleted, markTopicAsCompleted, getShaderAnswer, saveShaderAnswer } from '@/utils/topicCompletionUtils'

const route = useRoute()
const router = useRouter()
const [collectSlug, topicSlug] = route.path.split('/').filter(Boolean)

// 本地存储键名 - 保留以兼容旧数据
const STORAGE_KEY_PREFIX = 'shader_answer_';

// 数据状态
const currentTopicData = ref<TopicData | null>(null)
const sceneSettings = ref<SceneSettings | null>(null)
const isCompleted = ref(false)

const clock = new THREE.Clock()
const iTime = ref(0)
let iTimeIntervalId: number | undefined = undefined

function updateITime() {
  iTime.value = clock.getElapsedTime()
  iTimeIntervalId = requestAnimationFrame(updateITime)
}


const canvasRef1 = ref<InstanceType<typeof ThreeCanvas> | null>(null)
const canvasRef2 = ref<InstanceType<typeof ThreeCanvas> | null>(null)

const editForm = ref({
  vertexShader: '',
  fragmentShader: '',
})

// 当前编辑的着色器类型
const activeShaderTab = ref('fragment')

// 添加反馈状态
const feedbackState = ref({
  show: false,
  success: false,
  message: ''
})

// 添加成功弹窗状态
const successModal = ref({
  show: false,
  message: ''
})

// 添加庆祝动画状态
const showCelebration = ref(false)

// 添加加载状态
const isSubmitting = ref(false)

// 存储定时器ID，以便清除
const timers = ref<number[]>([])
// 存储间隔定时器ID
let frameCheckIntervalId: number | undefined = undefined

// 初始化数据
onMounted(() => {
  loadTopicData()
  updateITime()
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 清除所有定时器
  timers.value.forEach(timerId => clearTimeout(timerId))
  timers.value = []

  // 清除帧检查间隔定时器
  if (frameCheckIntervalId !== undefined) {
    clearInterval(frameCheckIntervalId)
    frameCheckIntervalId = undefined
  }

  // 确保动画状态被重置
  showCelebration.value = false
  isSubmitting.value = false
  feedbackState.value.show = false
  successModal.value.show = false

  if (iTimeIntervalId !== undefined) {
    cancelAnimationFrame(iTimeIntervalId)
    iTimeIntervalId = undefined
  }
})

// 加载主题数据 
function loadTopicData() {
  const { topicData } = getTopicData(collectSlug, topicSlug)

  if (topicData) {
    activeShaderTab.value = topicData?.vertexCodeEditable ? 'vertex' : 'fragment'
    sceneSettings.value = JSON.parse(topicData?.child.task.sceneSettings)

    currentTopicData.value = topicData

    // 首先尝试从新的存储方式获取答案
    const savedAnswer = getShaderAnswer(collectSlug, topicSlug);

    // 如果新存储中没有找到，尝试从旧存储中获取
    if (!savedAnswer) {
      const storageKey = `${STORAGE_KEY_PREFIX}${collectSlug}_${topicSlug}`;
      const oldSavedAnswer = localStorage.getItem(storageKey);

      if (oldSavedAnswer) {
        try {
          const parsedAnswer = JSON.parse(oldSavedAnswer);
          // 如果有保存的答案，使用保存的答案
          editForm.value.vertexShader = parsedAnswer.vertexShader || topicData.defaultVertexShader;
          editForm.value.fragmentShader = parsedAnswer.fragmentShader || topicData.defaultFragmentShader;
          // 标记为已完成
          isCompleted.value = true;

          // 将旧数据迁移到新存储
          saveShaderAnswer(collectSlug, topicSlug, {
            vertexShader: parsedAnswer.vertexShader,
            fragmentShader: parsedAnswer.fragmentShader
          });
        } catch (e) {
          console.error('解析保存的答案失败', e);
          // 如果解析失败，使用默认值
          editForm.value.vertexShader = topicData.defaultVertexShader;
          editForm.value.fragmentShader = topicData.defaultFragmentShader;
        }
      } else {
        // 没有保存的答案，使用默认值
        editForm.value.vertexShader = topicData.defaultVertexShader;
        editForm.value.fragmentShader = topicData.defaultFragmentShader;
      }
    } else {
      // 使用新存储中的答案
      editForm.value.vertexShader = savedAnswer.vertexShader || topicData.defaultVertexShader;
      editForm.value.fragmentShader = savedAnswer.fragmentShader || topicData.defaultFragmentShader;
      // 标记为已完成
      isCompleted.value = true;
    }

    // 检查题目是否已完成
    checkIfTopicCompleted();
  } else {
    console.error('有问题 反馈给🍊')
  }
}

// 检查题目是否已完成
function checkIfTopicCompleted() {
  isCompleted.value = isTopicCompleted(collectSlug, topicSlug);
}

// 保存已完成的题目
function saveCompletedTopic() {
  markTopicAsCompleted(collectSlug, topicSlug);
  isCompleted.value = true;
}

// 保存用户答案到本地存储
function saveAnswerToLocalStorage() {
  if (currentTopicData.value) {
    // 使用新的存储方式
    saveShaderAnswer(collectSlug, topicSlug, {
      vertexShader: editForm.value.vertexShader,
      fragmentShader: editForm.value.fragmentShader
    });

    // 同时保存到旧存储，以保持兼容性
    const storageKey = `${STORAGE_KEY_PREFIX}${collectSlug}_${topicSlug}`;
    const answerToSave = {
      vertexShader: editForm.value.vertexShader,
      fragmentShader: editForm.value.fragmentShader,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(storageKey, JSON.stringify(answerToSave));
  }
}

// 运行
function handleRunCode() {
  canvasRef2.value?.updateMaterial(editForm.value.vertexShader, editForm.value.fragmentShader)
}

// 提交
function handleSubmitCode() {
  // 设置加载状态
  isSubmitting.value = true
  const startTime = Date.now(); // 记录开始时间
  const minLoadingTime = 500; // 最小加载时间（毫秒）

  // 对于动画着色器，需要连续判断多帧
  const totalFrames = 50; // 判断50帧
  let matchedFrames = 0;
  let currentFrame = 0;
  let hasFailure = false; // 标记是否有不匹配的帧
  let pendingResult: boolean | null = null; // 存储待处理的结果

  // 清除之前可能存在的间隔定时器
  if (frameCheckIntervalId !== undefined) {
    clearInterval(frameCheckIntervalId)
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

      // 计算已经过去的时间
      const elapsedTime = Date.now() - startTime;

      // 如果已经超过最小加载时间，立即结束检查
      if (elapsedTime >= minLoadingTime) {
        clearInterval(frameCheckIntervalId);
        frameCheckIntervalId = undefined;
        finishCheck(false);
      } else {
        // 否则，存储结果，等待最小加载时间结束
        pendingResult = false;

        // 设置定时器，在达到最小加载时间后结束检查
        const remainingTime = minLoadingTime - elapsedTime;
        setTimeout(() => {
          if (frameCheckIntervalId !== undefined) {
            clearInterval(frameCheckIntervalId);
            frameCheckIntervalId = undefined;
          }
          if (pendingResult !== null) {
            finishCheck(pendingResult);
          }
        }, remainingTime);
      }
      return;
    }

    currentFrame++;

    // 检查是否已完成所有帧的检查
    if (currentFrame >= totalFrames) {
      clearInterval(frameCheckIntervalId);
      frameCheckIntervalId = undefined;

      // 计算已经过去的时间
      const elapsedTime = Date.now() - startTime;

      // 如果已经超过最小加载时间，立即完成检查
      if (elapsedTime >= minLoadingTime) {
        finishCheck(true);
      } else {
        // 否则，存储结果，等待最小加载时间结束
        pendingResult = true;

        // 设置定时器，在达到最小加载时间后结束检查
        const remainingTime = minLoadingTime - elapsedTime;
        setTimeout(() => {
          if (pendingResult !== null) {
            finishCheck(pendingResult);
          }
        }, remainingTime);
      }
    }
  }, 100); // 每100ms检查一次

  function finishCheck(isSuccess: boolean) {
    // 关闭加载状态
    isSubmitting.value = false;

    // 判断是否通过
    if (isSuccess) {
      console.log('通过!');

      // 显示失败反馈 (仅在失败时使用)
      feedbackState.value.show = false;

      // 保存答案到本地存储
      saveAnswerToLocalStorage();

      // 标记题目为已完成
      saveCompletedTopic();
      isCompleted.value = true;

      // 显示成功弹窗
      successModal.value = {
        show: true,
        message: `恭喜！提交成功！你的着色器实现与预期一致。`
      };

      // 显示庆祝动画
      showCelebration.value = true;

      // 3秒后隐藏庆祝动画
      const celebrationTimer = setTimeout(() => {
        showCelebration.value = false;
      }, 3000);
      timers.value.push(celebrationTimer);

      // 刷新侧边栏菜单状态
      refreshSidebarStatus();
    } else {
      console.log('失败');
      // 显示失败反馈
      feedbackState.value = {
        show: true,
        success: false,
        message: `失败，你的着色器实现与预期不一致，请检查并修改。`
      };

      // 3秒后自动隐藏失败消息
      const feedbackTimer = setTimeout(() => {
        feedbackState.value.show = false;
      }, 3000);
      timers.value.push(feedbackTimer);
    }
  }
}

// 刷新侧边栏菜单状态
function refreshSidebarStatus() {
  // 使用事件总线触发刷新事件
  window.dispatchEvent(new CustomEvent('topic-completed', {
    detail: { collectSlug, topicSlug }
  }));

  // 强制刷新侧边栏组件
  nextTick(() => {
    // 查找并更新对应的菜单项
    const menuItem = document.querySelector(`a[href="/${collectSlug}/${topicSlug}"]`);
    if (menuItem) {
      // 如果菜单项存在但没有完成标记，添加完成标记
      if (!menuItem.querySelector('.bg-\\[\\#4ca154\\]')) {
        // 创建完成标记元素
        const completionMark = document.createElement('div');
        completionMark.className = 'flex-shrink-0 w-4 h-4 rounded-full bg-[#4ca154] flex items-center justify-center';
        completionMark.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
            stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        // 将完成标记添加到菜单项的开头
        menuItem.insertBefore(completionMark, menuItem.firstChild);
      }

      // 滚动到当前菜单项
      menuItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 添加临时高亮效果
      menuItem.classList.add('highlight-active');
      setTimeout(() => {
        menuItem.classList.remove('highlight-active');
      }, 2000);
    }
  });
}

// 运行并提交
function handleRunAndSubmitCode() {
  // 先运行代码
  handleRunCode();

  // 然后提交
  handleSubmitCode();
}

// 比较两个像素数据是否相同
function comparePixelData(data1: any, data2: any) {
  if (data1.width !== data2.width || data1.height !== data2.height) {
    return false;
  }

  const buffer1 = data1.data;
  const buffer2 = data2.data;

  // 可以设置一个容差值，因为浮点数精度问题可能导致轻微差异
  const tolerance = 5;

  for (let i = 0; i < buffer1.length; i++) {
    if (Math.abs(buffer1[i] - buffer2[i]) > tolerance) {
      return false;
    }
  }

  return true;
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

// 关闭成功弹窗
function closeSuccessModal() {
  successModal.value.show = false;
}

// 前往下一题
function goToNextTopic() {
  // 获取当前集合中的所有题目
  if (currentTopicData.value && currentTopicData.value.collection) {
    const collection = currentTopicData.value.collection;
    const topics = collection.topics || [];

    // 找到当前题目的索引
    const currentIndex = topics.findIndex((topic: any) => topic.slug === topicSlug);

    // 如果找到当前题目且不是最后一题
    if (currentIndex !== -1 && currentIndex < topics.length - 1) {
      // 获取下一题的slug
      const nextTopic = topics[currentIndex + 1];
      // 导航到下一题
      router.push(`/${collectSlug}/${nextTopic.slug}`);
    }

    // 关闭弹窗
    closeSuccessModal();
  }
}

</script>

<template>
  <div class="shader-problem-container">
    <!-- 消息提示 (仅用于失败情况) -->
    <Transition name="fade">
      <div v-if="feedbackState.show" class="feedback-message"
        :class="{ 'success': feedbackState.success, 'error': !feedbackState.success }">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-alert-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="message-content">
          <p class="message-title">失败</p>
          <p class="message-description">{{ feedbackState.message }}</p>
        </div>
        <button class="close-button" @click="feedbackState.show = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-x">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- 成功弹窗 -->
    <Transition name="modal-fade">
      <div v-if="successModal.show" class="success-modal-overlay">
        <div class="success-modal">
          <h3 class="success-title">提交成功</h3>
          <div class="success-message">
            <p>{{ successModal.message }}</p>
          </div>
          <div class="success-divider"></div>
          <div class="success-actions">
            <button class="btn-next" @click="goToNextTopic">下一题</button>
            <button class="btn-close" @click="closeSuccessModal">关闭</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 加载遮罩 -->
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner">
        <!-- 顶部装饰线 -->
        <div class="top-line"></div>

        <!-- 新的加载动画 -->
        <div class="loader">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
        <div class="loading-text">
          <span class="loading-title">正在验证着色器</span>
          <span class="loading-description">请稍候，正在对比渲染结果...</span>
        </div>
        <!-- 进度条效果 -->
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full lg:overflow-hidden ">
      <!-- 左侧题目区域 -->
      <div class="flex flex-col lg:col-span-5 bg-card h-[500px] lg:h-full overflow-y-auto">
        <ProblemContent v-if="currentTopicData" :topicData="currentTopicData" />
      </div>

      <!-- 右侧代码和输出区域 -->
      <div class="lg:col-span-7 flex flex-col bg-background h-full lg:overflow-y-auto">
        <!-- 代码编辑区域 -->
        <div class="h-full flex-1 bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col">
          <!-- 顶部区域：着色器类型切换标签 -->
          <div class="flex mb-4">
            <button class="px-4 py-2 text-sm font-medium truncate" v-if="currentTopicData?.vertexCodeEditable"
              :class="activeShaderTab === 'vertex' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="activeShaderTab = 'vertex'">
              vertex.glsl
            </button>
            <button class="px-4 py-2 text-sm font-medium truncate" v-if="currentTopicData?.fragmentCodeEditable"
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
                    <ThreeCanvas v-if="sceneSettings" ref="canvasRef1" :currentTopicData="currentTopicData"
                      :iTime="iTime" :scene-settings="sceneSettings"
                      :vertex-shader="currentTopicData?.vertexShader || ''"
                      :fragment-shader="currentTopicData?.fragmentShader || ''" />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium mb-2 text-foreground truncate">实际输出</div>
                  <div class="h-36 rounded-md overflow-hidden">
                    <ThreeCanvas v-if="sceneSettings" ref="canvasRef2" :currentTopicData="currentTopicData"
                      :iTime="iTime" :scene-settings="sceneSettings" :vertex-shader="editForm?.vertexShader || ''"
                      :fragment-shader="editForm?.fragmentShader || ''" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <ActionButtons :active-shader-type="activeShaderTab" @run="handleRunCode" @submit="handleSubmitCode"
              @run-and-submit="handleRunAndSubmitCode" @reset="handleResetCode" :is-submitting="isSubmitting" />
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
}

.success-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
  padding-top: 50px;
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
  animation: progress 2s ease-in-out infinite;
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

/* 移除完成状态标记样式 */
.completion-badge {
  display: none;
  /* 隐藏而不是完全删除，以防将来需要恢复 */
}

/* 庆祝动画样式 */
.celebration-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 999;
}

.success-ripple {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #4ca154;
  opacity: 0;
  transform: scale(0);
  animation: ripple 1.5s ease-out forwards;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }

  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.success-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4ca154;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: scale(0) rotate(-90deg);
  animation: icon-appear 0.5s 0.2s ease-out forwards;
  box-shadow: 0 0 20px rgba(76, 161, 84, 0.5);
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

.success-text {
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  color: #4ca154;
  opacity: 0;
  transform: translateY(20px);
  animation: text-appear 0.5s 0.5s ease-out forwards;
}

@keyframes text-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(80px);
  }
}

.stars-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size, 10px);
  height: var(--size, 10px);
  background-color: var(--color, #6abf72);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  animation: star-shoot var(--duration, 0.8s) var(--delay, 0s) ease-out forwards;
}

@keyframes star-shoot {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }

  100% {
    opacity: 0;
    transform:
      translate(calc(-50% + var(--x, 60px)),
        calc(-50% + var(--y, 60px))) scale(0.5) rotate(180deg);
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
