const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fileImageData = require('../src/data/filesImage.json');
const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYxMSwicGVybWlzc2lvbnMiOlsicHJvZmlsZV92aWV3IiwidXNlcnNfcmF0aW5nIiwidGFza192aWV3IiwidGFza19zdWJtaXQiLCJtb2R1bGVfdmlldyIsInByb2ZpbGVfdmlld19hbGwiXSwic2Vzc2lvbklkIjo0MDk2LCJpYXQiOjE3NDE5MzkwOTIsImV4cCI6MTc0MTk0MjY5Mn0.3iIf6CseBXOls1-6vqOXq1ukmVSo_4k15a3ac6xHW14'

// 确保目标目录存在
const filesDir = path.resolve(__dirname, '../public/files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
    console.log(`创建目录: ${filesDir}`);
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
 * 从URL中提取文件名
 * @param {string} url 图片URL
 * @returns {string} 文件名
 */
function getFileNameFromUrl(url) {
    // 从URL中提取文件名
    const urlParts = url.split('/');
    let fileName = urlParts[urlParts.length - 1];
    
    // 处理查询参数
    if (fileName.includes('?')) {
        fileName = fileName.split('?')[0];
    }
    
    // 确保文件名有扩展名
    if (!fileName.includes('.')) {
        // 如果没有扩展名，默认为jpg
        fileName += '.jpg';
    }
    
    return fileName;
}

/**
 * 主函数：下载所有图片
 */
async function processAllImages() {
    try {
        // 验证 fileImageData 是否为数组
        if (!Array.isArray(fileImageData)) {
            console.error('filesImage.json 不是有效的数组格式');
            return;
        }
        
        const imageUrls = fileImageData;
        console.log(`从 filesImage.json 中读取到 ${imageUrls.length} 个图片URL`);

        // 下载所有图片
        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];
            
            // 验证URL格式
            if (typeof url !== 'string' || !url.startsWith('https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/')) {
                console.warn(`跳过无效的URL: ${url}`);
                continue;
            }
            
            const fileName = getFileNameFromUrl(url);
            const filePath = path.join(filesDir, fileName);
            
            console.log(`[${i+1}/${imageUrls.length}] 下载图片: ${url} -> ${filePath}`);
            
            try {
                await downloadImage(url, filePath);
                console.log(`图片下载成功: ${fileName}`);
            } catch (error) {
                console.error(`图片下载失败: ${fileName}`, error);
            }
        }

        console.log('所有图片处理完成!');
    } catch (error) {
        console.error('处理过程中发生错误:', error);
    }
}

// 执行主函数
processAllImages().then(() => {
    console.log('脚本执行完毕');
}).catch(err => {
    console.error('脚本执行失败:', err);
    process.exit(1);
});
