// 获取 习题 集合 list
// get : https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/modules/list
/**
 * 形如
 * [
 *  {
 *      "id": 2,
 *      "slug": "built-in-functions",
 *      "name": "Built-in functions",
 *      "description": "Understand the role of fragment shaders in the graphics pipeline and explore a large collection of built-in GLSL functions.",
 *      "tasks": 33,
 *      "acceptedTasks": 1,
 *      "order": 0,
 *      "locked": false,
 *      "cover": true
 *  }
 * ]
 */

// 获取 集合 下的 习题 list
// get : https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/modules/${集合.slug}/user/progress
/**
 * 形如
 * {
 *     "id": 2,
 *     "slug": "built-in-functions",
 *     "name": "Built-in functions",
 *     "description": "Understand the role of fragment shaders in the graphics pipeline and explore a large collection of built-in GLSL functions.",
 *     "order": 0,
 *     "createdBy": {
 *         "id": 3,
 *         "name": "Alexander"
 *     },
 *     "locked": false,
 *     "tasks": [
 *         {
 *             "id": 89,
 *             "slug": "fragment-shader",
 *             "moduleId": 2,
 *             "name": "Fragment Shader",
 *             "order": 0,
 *             "cost": 5,
 *             "score": 5,
 *             "accepted": true,
 *             "rejected": false,
 *             "match": 1,
 *             "locked": false,
 *             "premiumLock": 0,
 *             "premium": false
 *         }
 *     ],
 *     "cover": true,
 *     "pageHeaderImage": true,
 *     "fullDesc": "This module is designed for beginner developers who want to learn the basics of fragment shaders and basic built-in GLSL functions. During the course, you will learn how fragment shaders work and how to use basic GLSL functions to create visual effects. Each topic is accompanied by theoretical material and a practical task that can be completed directly on the website.",
 *     "skillsDesc": "what a fragment shader is, how they work, and why they are needed.<br>basic GLSL functions in practice and how they can be used to create visual effects.<br>how to create animated effects using time.<br>the basics of working with textures.",
 *     "importanceDesc": "Fragment shaders and GLSL functions are fundamental for creating graphical effects in computer games, animation, and other visual applications. Understanding these technologies allows developers to create diverse visual effects, optimize the performance of graphical applications, and expand their skills in computer graphics.",
 *     "certifiable": true,
 *     "images": [
 *         "img-1.png",
 *     ]
 * }
 */


// 获取 习题 详情
// get : https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/tasks/${习题.slug}/userTask
/**
 * 形如
 * {
 *  "task": {
 *      "id": 89,
 *      "slug": "fragment-shader",
 *      "moduleId": 2,
 *      "name": "Fragment Shader",
 *      "vertexShader": "\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",
 *      "fragmentShader": "void main() {\n  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}",
 *      "defaultVertexShader": "\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",
 *      "defaultFragmentShader": "void main() {\n  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n",
 *      "vertexCodeEditable": false,
 *      "fragmentCodeEditable": true,
 *      "postProcessCodeEditable": false,
 *      "propertiesEditable": false,
 *      "sceneSettings": "{\"camera\":{\"position\":{\"x\":-0.5,\"y\":-0.5,\"z\":1},\"rotation\":{\"x\":0,\"y\":0,\"z\":0},\"isOrthographic\":true,\"near\":0.1,\"far\":100,\"fov\":75,\"left\":0,\"right\":1,\"top\":1,\"bottom\":0},\"objects\":[{\"position\":{\"x\":0,\"y\":0,\"z\":0},\"rotation\":{\"x\":0,\"y\":0,\"z\":0},\"scale\":{\"x\":1,\"y\":1,\"z\":1},\"geometry\":1,\"colorRGBA\":\"FFFFFF\",\"color\":null}],\"backgroundRGBA\":\"FAFAFA\",\"background\":16448250}",
 *      "description": "**Fragment shader** is a type of shader program used in computer graphics to control the appearance of individual pixels on a screen or surface. Fragment shaders are responsible for determining the final color of each pixel after all other stages of the rendering pipeline have been completed.\n\n<br>\n\n### How a Fragment Shader Works:\n\n1. **Input Data**: The fragment shader receives input data from the previous stages of the rendering pipeline, such as position, texture coordinates, normals, and other attributes associated with each pixel.\n\n2. **Processing**: The fragment shader calculates the final color of each pixel based on the input data and any additional parameters or textures provided. This calculation can involve various operations, such as texture sampling, lighting calculations, color blending, and more.\n\n3. **Output**: The fragment shader outputs the final color of each pixel, which is then combined with other pixels to generate the final image that is displayed on the screen.\n\nFragment shaders are written in specialized programming languages such as **GLSL** (OpenGL Shading Language) and are executed on the GPU (Graphics Processing Unit) for optimal performance.\n\n<br>\n\nIn OpenGL, a fragment shader has a single `main` function that produces a color value by writing it to the predefined output variable `gl_FragColor`. This variable represents the final color of the current fragment/pixel being processed by the shader. The `gl_FragColor` variable is of type `vec4`, which represents a 4-component vector containing red, green, blue, and alpha (transparency) values. Color components are normalized, ranging from 0.0 to 1.0.\n\n<br>\n\nYou can customize the logic inside the `main` function to calculate the final color based on your specific requirements, such as applying textures, performing lighting calculations, or blending colors.\n\n### Task\nWrite a shader program that modifies the output color to yellow, which is a combination of red and green.",
 *      "hints": [],
 *      "restrictions": [],
 *      "order": 0,
 *      "cost": 5,
 *      "threshold": 95,
 *      "likes": 37,
 *      "dislikes": 1,
 *      "visibility": true,
 *      "createdBy": {
 *          "id": 3,
 *          "name": "Alexander"
 *      },
 *      "channels": [],
 *      "animated": false,
 *      "animationSteps": null,
 *      "animationStepTime": null,
 *      "rules": [
 *          {
 *              "id": 1,
 *              "default": true,
 *              "keyword": "if",
 *              "message": "Branching can slow down the speed of your program",
 *              "severity": 1
 *          }
 *      ],
 *      "premium": false
 *  },
 *  "vertexShader": "\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",
 *  "fragmentShader": "void main() {\n  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}\n",
 *  "defaultVertexShader": "\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",
 *  "defaultFragmentShader": "void main() {\n  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n",
 *  "liked": false,
 *  "disliked": false,
 *  "accepted": true,
 *  "answerViewed": false,
 *  "submissions": [
 *      {
 *          "score": 5,
 *          "accepted": true,
 *          "vertexShader": "\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",
 *          "fragmentShader": "void main() {\n  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}\n",
 *          "at": "2025-03-11T08:47:39.000Z"
 *      },
 *  ]
 * }
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// API基础URL
const BASE_URL = 'https://whale-app-toyuq.ondigitalocean.app/shader-learning-api';
const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYxMSwicGVybWlzc2lvbnMiOlsicHJvZmlsZV92aWV3IiwidXNlcnNfcmF0aW5nIiwidGFza192aWV3IiwidGFza19zdWJtaXQiLCJtb2R1bGVfdmlldyIsInByb2ZpbGVfdmlld19hbGwiXSwic2Vzc2lvbklkIjo0MDk2LCJpYXQiOjE3NDE5MzkwOTIsImV4cCI6MTc0MTk0MjY5Mn0.3iIf6CseBXOls1-6vqOXq1ukmVSo_4k15a3ac6xHW14'

// 创建axios实例
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Authorization': authorization
    },
});

// 获取习题集合列表
async function getModulesList() {
    try {
        const response = await api.get('/modules/list');
        return response.data;
    } catch (error) {
        console.error('获取习题集合列表失败:', error.message);
        return [];
    }
}

// 获取集合下的习题列表
async function getModuleProgress(moduleSlug) {
    try {
        const response = await api.get(`/modules/${moduleSlug}/user/progress`);
        return response.data;
    } catch (error) {
        console.error(`获取集合 ${moduleSlug} 下的习题列表失败:`, error.message);
        return null;
    }
}

// 获取习题详情
async function getTaskDetail(taskSlug) {
    try {
        const response = await api.get(`/tasks/${taskSlug}/userTask`);
        return response.data;
    } catch (error) {
        console.error(`获取习题 ${taskSlug} 详情失败:`, error.message);
        return null;
    }
}

// 构建菜单数据
async function buildMenuData() {
    // 获取所有模块
    const modules = await getModulesList();

    // 初始化菜单数据
    const menuData = {
        navMain: []
    };

    // 处理每个模块
    for (const module of modules) {
        console.log(`处理模块: ${module.name}`);

        // 获取模块详情和任务列表
        const moduleDetail = await getModuleProgress(module.slug);

        if (!moduleDetail) {
            console.error(`无法获取模块 ${module.slug} 的详情，跳过`);
            continue;
        }

        // 创建模块菜单项，直接使用 modules/list 接口返回的数据
        const moduleMenuItem = { ...module };
        
        // 添加 child 字段，直接存放 /modules/${集合.slug}/user/progress 接口返回的数据
        moduleMenuItem.child = { ...moduleDetail };

        // 处理模块中的每个任务
        if (moduleDetail.tasks && moduleDetail.tasks.length > 0) {
            for (const task of moduleDetail.tasks) {
                console.log(`  处理任务: ${task.name}`);

                // 获取任务详情
                const taskDetail = await getTaskDetail(task.slug);

                if (!taskDetail) {
                    console.error(`无法获取任务 ${task.slug} 的详情，跳过`);
                    continue;
                }
                
                // 直接将任务详情添加到对应任务中
                // 在 moduleDetail.tasks 数组中找到对应的任务
                const taskIndex = moduleMenuItem.child.tasks.findIndex(t => t.slug === task.slug);
                if (taskIndex !== -1) {
                    // 直接添加 child 字段，存放 /tasks/${习题.slug}/userTask 接口返回的数据
                    moduleMenuItem.child.tasks[taskIndex].child = taskDetail;
                }
            }
        }

        // 添加模块到主菜单
        menuData.navMain.push(moduleMenuItem);
    }

    // 按order排序模块
    menuData.navMain.sort((a, b) => a.order - b.order);

    return menuData;
}

// 保存菜单数据到文件
async function saveMenuData(menuData) {
    try {
        const outputDir = path.resolve(__dirname, '../src/data');

        // 确保目录存在
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'menu.json');
        fs.writeFileSync(outputPath, JSON.stringify(menuData, null, 4), 'utf8');

        console.log(`菜单数据已保存到: ${outputPath}`);
        return true;
    } catch (error) {
        console.error('保存菜单数据失败:', error.message);
        return false;
    }
}

// 主函数
async function main() {
    console.log('开始同步数据...');

    try {
        // 构建菜单数据
        const menuData = await buildMenuData();

        // 保存菜单数据
        await saveMenuData(menuData);

        console.log('数据同步完成!');
    } catch (error) {
        console.error('数据同步失败:', error);
    }
}

// 执行主函数
if (require.main === module) {
    main();
}

module.exports = {
    getModulesList,
    getModuleProgress,
    getTaskDetail,
    buildMenuData,
    saveMenuData,
    main
};






