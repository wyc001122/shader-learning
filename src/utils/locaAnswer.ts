export const ANSWER_KEY = 'shader-learn-answer'

// 获取答案
export const getAnswer = (course_slug: string, topic_slug: string) => {
    const all = localStorage.getItem(ANSWER_KEY) || '{}'
    const allObject = JSON.parse(all)
    const answer_vertex = allObject[`${course_slug}_${topic_slug}_vertex`]
    const answer_fragment = allObject[`${course_slug}_${topic_slug}_fragment`]
    if (!answer_vertex || !answer_fragment) {
        return null
    }

    return {
        vertexShader: answer_vertex,
        fragmentShader: answer_fragment,
    }
}

// 保存答案
export const setAnswer = (course_slug: string, topic_slug: string, value: {
    vertexShader: string,
    fragmentShader: string,
}) => {
    const all = localStorage.getItem(ANSWER_KEY) || '{}'
    const allObject = JSON.parse(all)
    allObject[`${course_slug}_${topic_slug}_vertex`] = value.vertexShader
    allObject[`${course_slug}_${topic_slug}_fragment`] = value.fragmentShader
    localStorage.setItem(ANSWER_KEY, JSON.stringify(allObject))
}

