# Chatbot Demo 实施计划

版本：v0.2  
更新日期：2026-05-19

## 技术方案

| 项 | 选择 |
| --- | --- |
| 框架 | Next.js App Router |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 + CSS 变量 |
| 后端代理 | Next.js Route Handler |
| 模型服务 | DeepSeek OpenAI 兼容接口 |
| 持久化 | 浏览器 `localStorage` |
| Markdown | `react-markdown` + `remark-gfm` |
| 代码高亮 | `react-syntax-highlighter` |

## 当前架构

```text
Browser
  ├─ React UI
  ├─ localStorage conversations
  └─ POST /api/chat
        └─ Next.js Route Handler
              └─ DeepSeek /chat/completions
```

## 已完成范围

- 项目脚手架、TypeScript、ESLint、Tailwind 配置。
- Claude 风格基础布局：侧边栏、主聊天区、底部输入框。
- 会话新建、切换、标题生成和本地持久化。
- DeepSeek 服务端代理和 SSE 转发。
- 前端 SSE 解析、流式追加、停止生成、错误提示。
- Markdown、GFM、代码高亮、代码块复制。
- README、环境变量示例和任务文档。

## 后续计划

### Phase 2：体验增强

- 删除会话。
- 深色模式。
- 侧边栏折叠与移动端抽屉。
- 模型切换：`deepseek-chat` / `deepseek-reasoner`。
- 单条消息复制。

### Phase 3：完善

- 重新生成最后一条助手消息。
- 会话重命名。
- `/api/health` 健康检查。
- 简单 rate limit。
- 部署说明或 Dockerfile。

## 质量门槛

每次交付前至少运行：

```bash
npm run lint
npm run build
```

涉及行为变更时，需要在浏览器手动验证发送、停止、刷新保留和错误提示。
