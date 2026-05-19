# Chatbot Demo 任务清单

版本：v0.2  
更新日期：2026-05-19

## 进度总览

| 阶段 | 状态 |
| --- | --- |
| Phase 0 项目基建 | 已完成 |
| Phase 1 MVP | 已完成 |
| Phase 2 体验增强 | 未开始 |
| Phase 3 完善 | 未开始 |

## Phase 0 项目基建

- [x] 使用 Next.js App Router、TypeScript、Tailwind、ESLint 初始化项目。
- [x] 配置 `dev`、`build`、`lint`、`start` 脚本。
- [x] 添加 `.env.example`。
- [x] `.gitignore` 排除本地环境变量。
- [x] 定义 Claude 风格浅色 CSS 变量。
- [x] 创建会话和消息类型。

## Phase 1 MVP

- [x] 实现 `localStorage` 会话读写。
- [x] 实现 `useConversations`：新建、切换、当前会话、标题生成。
- [x] 实现发送流程：用户消息、助手占位消息、流式更新。
- [x] 实现 DeepSeek 服务端封装。
- [x] 实现 `POST /api/chat` 请求校验和 SSE 转发。
- [x] 实现错误映射：400、401、429、502、499。
- [x] 支持 `AbortSignal` 停止生成。
- [x] 实现前端 `streamChat` SSE 解析。
- [x] 实现 `useChatStream` 流式状态管理。
- [x] 实现 `AppLayout`、`Sidebar`、`ConversationList`。
- [x] 实现 `ChatHeader`、`MessageList`、`MessageItem`。
- [x] 实现 `ChatInput`：自动增高、Enter 发送、Shift+Enter 换行、停止按钮。
- [x] 实现 `ErrorBanner`。
- [x] 接入 `react-markdown` 和 `remark-gfm`。
- [x] 实现代码块高亮和复制。
- [x] 编写 README 和项目文档。

## Phase 2 体验增强

- [ ] 深色主题和本地记忆。
- [ ] 删除会话。
- [ ] 侧边栏折叠。
- [ ] 移动端抽屉侧边栏。
- [ ] 模型切换。
- [ ] 单条消息复制。
- [ ] Phase 2 smoke test。

## Phase 3 完善

- [ ] 重新生成最后一条助手消息。
- [ ] 会话重命名。
- [ ] 消息数量较多时虚拟滚动。
- [ ] `GET /api/health`。
- [ ] 简单 rate limit。
- [ ] 非流式调试响应。
- [ ] 部署说明或 Dockerfile。

## MVP 自测清单

- [ ] 配置 `.env.local` 后发送消息，助手流式回复。
- [ ] 连续 3 轮对话，上下文连贯。
- [ ] 点击停止，生成中断并保留已输出内容。
- [ ] 刷新页面，会话列表与消息仍在。
- [ ] 助手回复包含代码块时可高亮并复制。
- [ ] DevTools Network 中 `/api/chat` 请求没有暴露 API Key。
- [ ] 未配置 Key 时有明确错误提示。
