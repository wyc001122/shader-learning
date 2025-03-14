# 着色器学习数据同步工具

这个工具用于从着色器学习网站API同步数据，并生成包含详细信息的menu.json文件。

## 功能

- 获取所有习题集合列表
- 获取每个集合下的习题列表
- 获取每个习题的详细信息
- 将所有数据整合到一个结构化的menu.json文件中

## 安装

```bash
# 安装依赖
npm install
```

## 使用方法

```bash
# 运行同步脚本
npm run sync
```

脚本将从API获取数据并生成`src/data/menu.json`文件。

## 数据结构

生成的menu.json文件包含以下结构：

```json
{
  "navMain": [
    {
      "title": "模块名称",
      "url": "/模块slug",
      "slug": "模块slug",
      "items": [
        {
          "title": "习题名称",
          "url": "/模块slug/习题slug",
          "slug": "习题slug",
          "isActive": false,
          "description": "习题描述",
          "cost": 5,
          "order": 0,
          "accepted": false,
          "locked": false,
          "premium": false,
          "vertexShader": "顶点着色器代码",
          "fragmentShader": "片段着色器代码",
          "defaultVertexShader": "默认顶点着色器代码",
          "defaultFragmentShader": "默认片段着色器代码",
          "vertexCodeEditable": false,
          "fragmentCodeEditable": true
        }
      ],
      "description": "模块描述",
      "fullDesc": "模块完整描述",
      "skillsDesc": "技能描述",
      "importanceDesc": "重要性描述",
      "certifiable": true,
      "cover": true,
      "order": 0
    }
  ]
}
```

## API端点

脚本使用以下API端点：

1. 获取习题集合列表：`/modules/list`
2. 获取集合下的习题列表：`/modules/{moduleSlug}/user/progress`
3. 获取习题详情：`/tasks/{taskSlug}/userTask`
