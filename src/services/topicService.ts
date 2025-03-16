import menuData from '@/data/menu.json'
import markdownit from 'markdown-it'
import hljs from "highlight.js"

const md = markdownit({ html: true })

// 任务详情中的任务数据
export interface TaskDetail {
  description: string
  fragmentShader: string
  vertexShader: string
  defaultFragmentShader: string
  defaultVertexShader: string
  [key: string]: any
}

// 原始任务数据
export interface RawTopicData {
  id: number
  slug: string
  name: string
  description: string
  child?: {
    task: TaskDetail
    [key: string]: any
  }
  [key: string]: any
}

// 处理后的任务数据，包含渲染后的内容
export interface TopicData {
  id: number
  slug: string
  name: string
  description: string
  task: string
  theory: string
  fragmentShader: string
  vertexShader: string
  defaultFragmentShader: string
  defaultVertexShader: string
  fragment_answer: string
  vertex_answer: string
  [key: string]: any
}

// 模块数据
export interface ModuleData {
  id: number
  slug: string
  name: string
  description: string
  tasks: number
  acceptedTasks: number
  order: number
  locked: boolean
  cover: boolean
  child: {
    id: number
    slug: string
    name: string
    description: string
    tasks: RawTopicData[]
    [key: string]: any
  }
  [key: string]: any
}

/**
 * 获取任务数据
 * @param collectSlug 模块slug
 * @param topicSlug 任务slug
 * @returns 处理后的模块和任务数据
 */
export function getTopicData(collectSlug: string, topicSlug: string): {
  collectData: ModuleData | null,
  topicData: TopicData | null
} {
  // 查找模块数据
  const collectData = menuData.navMain.find((module: any) => module.slug === collectSlug) as ModuleData | undefined || null

  if (!collectData) {
    console.log('没有找到模块数据')
    return { collectData: null, topicData: null }
  }

  // 确保模块有子任务
  if (!collectData.child || !collectData.child.tasks || !collectData.child.tasks.length) {
    console.log('模块没有任务数据')
    return { collectData, topicData: null }
  }

  // 查找任务数据
  const rawTopicData = collectData.child.tasks.find((task: RawTopicData) => task.slug === topicSlug) || null

  if (!rawTopicData) {
    console.log('没有找到任务数据')
    return { collectData, topicData: null }
  }

  // 处理任务详情数据
  let topicData: TopicData | null = null

  if (rawTopicData.child && rawTopicData.child.task) {
    const taskDetail = rawTopicData.child.task;

    let fragment_answer = hljs.highlight(taskDetail.fragmentShader, { language: 'glsl' }).value
    // 移除头部的空格
    fragment_answer = fragment_answer.replace(/^[\s\n]+/, '')
    let vertex_answer = hljs.highlight(taskDetail.vertexShader, { language: 'glsl' }).value
    // 移除头部的空格
    vertex_answer = vertex_answer.replace(/^[\s\n]+/, '')

    topicData = {
      ...rawTopicData,
      selectionName: collectData.slug,
      task: md.render(taskDetail.description.split('### Task').filter(Boolean)[1] || ''),
      theory: md.render(taskDetail.description.split('### Task').filter(Boolean)[0] || ''),
      fragmentShader: taskDetail.fragmentShader,
      vertexShader: taskDetail.vertexShader,
      defaultFragmentShader: taskDetail.defaultFragmentShader,
      defaultVertexShader: taskDetail.defaultVertexShader,
      fragment_answer: fragment_answer,
      vertex_answer: vertex_answer,
      channels: taskDetail.channels || [],
      vertexCodeEditable: taskDetail.vertexCodeEditable,
      fragmentCodeEditable: taskDetail.fragmentCodeEditable,
      postProcessCodeEditable: taskDetail.postProcessCodeEditable,
      propertiesEditable: taskDetail.propertiesEditable,
    }
  } else {
    console.log('任务没有详细数据')
    return { topicData: null }
  }

  return { topicData }
} 