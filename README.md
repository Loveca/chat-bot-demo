# Chatbot Demo

一个 Claude 风格的本地聊天 Demo，前端使用 Next.js，模型能力由 DeepSeek API 提供。

## 功能

- 侧边栏会话列表、主聊天区、底部输入框。
- 多轮对话、SSE 流式输出、停止生成。
- Markdown 渲染、代码高亮、代码块复制。
- 会话本地持久化到 `localStorage`。
- DeepSeek API Key 仅在服务端读取，不暴露给浏览器。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制示例文件并填入 DeepSeek API Key：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
DEEPSEEK_API_KEY=sk-your-key-here
```

### 3. 启动开发服务

```bash
npm run dev
```

打开 http://localhost:3000。

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | 是 | DeepSeek 平台密钥 |
| `DEEPSEEK_BASE_URL` | 否 | 默认 `https://api.deepseek.com` |
| `DEEPSEEK_DEFAULT_MODEL` | 否 | 默认 `deepseek-chat` |
| `SYSTEM_PROMPT` | 否 | 全局系统提示词 |
| `MAX_HISTORY_MESSAGES` | 否 | 发送给模型的最大历史消息数，默认 40 |

## 架构

```text
Browser (React) --POST /api/chat (SSE)--> Next.js Route Handler --> DeepSeek API
        |
        +-- localStorage (conversations)
```

## 文档

- [需求说明](./docs/REQUIREMENTS.md)
- [实施计划](./docs/PLANS.md)
- [任务清单](./docs/TASKS.md)

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发模式 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务 |
| `npm run lint` | ESLint |
