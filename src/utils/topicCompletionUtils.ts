// 本地存储键名
export const COMPLETED_TOPICS_KEY = 'completed_shader_topics';
export const SHADER_ANSWERS_KEY = 'shader_answers';

/**
 * 获取已完成的题目列表
 * @returns 已完成题目的ID列表
 */
export function getCompletedTopics(): string[] {
  const completedTopicsJson = localStorage.getItem(COMPLETED_TOPICS_KEY);
  if (completedTopicsJson) {
    try {
      return JSON.parse(completedTopicsJson);
    } catch (e) {
      console.error('解析已完成题目列表失败', e);
      return [];
    }
  }
  return [];
}

/**
 * 检查题目是否已完成
 * @param collectSlug 集合标识
 * @param topicSlug 题目标识
 * @returns 是否已完成
 */
export function isTopicCompleted(collectSlug: string, topicSlug: string): boolean {
  const completedTopics = getCompletedTopics();
  const topicKey = `${collectSlug}_${topicSlug}`;
  return completedTopics.includes(topicKey);
}

/**
 * 标记题目为已完成
 * @param collectSlug 集合标识
 * @param topicSlug 题目标识
 */
export function markTopicAsCompleted(collectSlug: string, topicSlug: string): void {
  const completedTopics = getCompletedTopics();
  const topicKey = `${collectSlug}_${topicSlug}`;
  
  if (!completedTopics.includes(topicKey)) {
    completedTopics.push(topicKey);
    localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(completedTopics));
  }
}

/**
 * 获取集合的完成进度
 * @param collectSlug 集合标识
 * @param totalTopics 集合中的总题目数
 * @returns 完成进度百分比
 */
export function getCollectionProgress(collectSlug: string, totalTopics: number): number {
  const completedTopics = getCompletedTopics();
  const completedInCollection = completedTopics.filter(key => key.startsWith(`${collectSlug}_`)).length;
  return Math.round((completedInCollection / totalTopics) * 100);
}

/**
 * 获取所有着色器答案
 * @returns 所有答案的对象
 */
export function getAllShaderAnswers(): Record<string, Record<string, any>> {
  const answersJson = localStorage.getItem(SHADER_ANSWERS_KEY);
  if (answersJson) {
    try {
      return JSON.parse(answersJson);
    } catch (e) {
      console.error('解析着色器答案失败', e);
      return {};
    }
  }
  return {};
}

/**
 * 获取特定题目的答案
 * @param collectSlug 集合标识
 * @param topicSlug 题目标识
 * @returns 题目的答案，如果不存在则返回null
 */
export function getShaderAnswer(collectSlug: string, topicSlug: string): any | null {
  const answers = getAllShaderAnswers();
  return answers[collectSlug]?.[topicSlug] || null;
}

/**
 * 保存着色器答案
 * @param collectSlug 集合标识
 * @param topicSlug 题目标识
 * @param answer 答案对象
 */
export function saveShaderAnswer(collectSlug: string, topicSlug: string, answer: any): void {
  const answers = getAllShaderAnswers();
  
  // 确保集合对象存在
  if (!answers[collectSlug]) {
    answers[collectSlug] = {};
  }
  
  // 保存答案
  answers[collectSlug][topicSlug] = {
    ...answer,
    timestamp: new Date().toISOString()
  };
  
  // 保存到本地存储
  localStorage.setItem(SHADER_ANSWERS_KEY, JSON.stringify(answers));
} 