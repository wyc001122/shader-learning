const fs = require('fs');
const path = require('path');
const axios = require('axios');
const menuData = require('../src/data/menu.json');
const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYxMSwicGVybWlzc2lvbnMiOlsicHJvZmlsZV92aWV3IiwidXNlcnNfcmF0aW5nIiwidGFza192aWV3IiwidGFza19zdWJtaXQiLCJtb2R1bGVfdmlldyIsInByb2ZpbGVfdmlld19hbGwiXSwic2Vzc2lvbklkIjo0MDk2LCJpYXQiOjE3NDE5MzkwOTIsImV4cCI6MTc0MTk0MjY5Mn0.3iIf6CseBXOls1-6vqOXq1ukmVSo_4k15a3ac6xHW14'

// 确保目标目录存在
const imagesDir = path.resolve(__dirname, '../src/assets/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log(`创建目录: ${imagesDir}`);
}

/**
 * 下载图片并保存到本地
 * @param {string} url 图片URL
 * @param {string} filePath 保存路径
 */
async function downloadImage(url, filePath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': authorization
            }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`下载图片失败: ${url}`, error.message);
        throw error;
    }
}

/**
 * 处理所有模块和任务
 */
async function processAllModules() {
    try {
        // 遍历所有模块
        for (const module of menuData.navMain) {
            console.log(`处理模块: ${module.name}`);

            // 确保模块有子任务
            if (!module.child || !module.child.tasks || !module.child.tasks.length) {
                console.log(`模块 ${module.name} 没有任务数据，跳过`);
                continue;
            }

            // 遍历所有任务
            for (const task of module.child.tasks) {
                console.log(`处理任务: ${task.name}`);

                // 检查任务是否有详情数据
                if (!task.child) {
                    console.log(`任务 ${task.name} 没有详情数据，跳过`);
                    continue;
                }

                // 检查任务详情是否有channels字段
                const taskDetail = task.child.task;
                if (!taskDetail || !taskDetail.channels || !taskDetail.channels.length) {
                    console.log(`任务 ${task.name} 没有channels数据，跳过`);
                    continue;
                }

                // 处理所有channels
                for (const channel of taskDetail.channels) {
                    const index = channel.index;
                    const url = `https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/tasks/${task.slug}/channel/${index}`;

                    // 使用 {集合}_{题目}_{通道} 格式命名文件
                    const fileName = `${module.slug}_${task.slug}_${index}.jpg`;
                    const filePath = path.join(imagesDir, fileName);

                    console.log(`下载图片: ${url} -> ${filePath}`);

                    try {
                        await downloadImage(url, filePath);
                        console.log(`图片下载成功: ${fileName}`);
                    } catch (error) {
                        console.error(`图片下载失败: ${fileName}`, error);
                    }
                }
            }
        }

        console.log('所有图片处理完成!');
    } catch (error) {
        console.error('处理过程中发生错误:', error);
    }
}

// 执行主函数
processAllModules().then(() => {
    console.log('脚本执行完毕');
}).catch(err => {
    console.error('脚本执行失败:', err);
    process.exit(1);
});
