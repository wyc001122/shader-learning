# Shader Learning（着色器学习）

这是一个用于学习和探索着色器的Vue 3项目，提供了丰富的着色器示例和学习资源。

## 项目简介

本项目是一个基于Vue 3、TypeScript和Vite构建的Web应用，旨在帮助开发者学习和理解着色器编程。项目提供了多种着色器示例，并支持实时编辑和预览功能。

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **UI组件**：Tailwind CSS
- **代码编辑器**：Monaco Editor
- **路由管理**：Vue Router
- **其他工具**：
  - highlight.js（代码高亮）
  - markdown-it（Markdown渲染）
  - viewerjs（图片查看器）

## 功能特点

- 丰富的着色器示例和教程
- 实时编辑和预览着色器代码
- 响应式设计，支持多种设备
- 暗色/亮色主题切换
- 代码高亮显示
- Markdown文档支持

## 安装与运行

### 前提条件

- Node.js (推荐v16+)
- pnpm (推荐)

### 安装步骤

1. 克隆仓库
```bash
git clone [仓库URL]
cd shader-learning
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

5. 预览生产版本
```bash
pnpm preview
```

## 数据同步

项目提供了几个脚本用于同步数据和资源：

```bash
# 同步着色器数据
pnpm sync

# 同步图片资源
pnpm sync-images

# 获取文件图片
pnpm get-file-images
```

## 项目结构

```
shader-learning/
├── public/          # 静态资源
├── script/          # 数据同步脚本
├── src/             # 源代码
│   ├── assets/      # 资源文件
│   ├── components/  # 组件
│   ├── data/        # 数据文件
│   ├── lib/         # 工具库
│   ├── router/      # 路由配置
│   ├── services/    # 服务
│   ├── types/       # TypeScript类型定义
│   ├── views/       # 页面视图
│   └── main.ts      # 入口文件
├── index.html       # HTML模板
└── vite.config.ts   # Vite配置
```

## 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 ISC 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
