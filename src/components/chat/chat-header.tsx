import { CHAT_MODELS, type ChatModel } from "@/lib/types";
import type { ThemeMode } from "@/lib/storage";

interface ChatHeaderProps {
  title: string;
  model: ChatModel;
  theme: ThemeMode;
  streamMode: boolean;
  onOpenSidebar: () => void;
  onModelChange: (model: ChatModel) => void;
  onThemeToggle: () => void;
  onStreamToggle: () => void;
}

export function ChatHeader({
  title,
  model,
  theme,
  streamMode,
  onOpenSidebar,
  onModelChange,
  onThemeToggle,
  onStreamToggle,
}: ChatHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--border-subtle)] px-4 md:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)] md:hidden"
        aria-label="打开侧边栏"
        title="打开侧边栏"
      >
        ☰
      </button>
      <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
        {title}
      </h2>
      <select
        value={model}
        onChange={(event) => onModelChange(event.target.value as ChatModel)}
        className="h-8 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 text-xs text-[var(--text-primary)] outline-none transition hover:bg-[var(--bg-hover)] focus:border-[var(--border-focus)]"
        aria-label="选择模型"
      >
        {CHAT_MODELS.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onStreamToggle}
        className={`flex h-8 items-center gap-1 rounded-md border px-2 text-xs transition ${
          streamMode
            ? "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            : "border-[var(--border-focus)] bg-[var(--accent)]/10 text-[var(--accent)]"
        }`}
        aria-label={streamMode ? "切换到非流式调试模式" : "切换到流式模式"}
        title={streamMode ? "流式模式" : "调试模式"}
      >
        {streamMode ? "流式" : "调试"}
      </button>
      <button
        type="button"
        onClick={onThemeToggle}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
        aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
        title={theme === "dark" ? "浅色主题" : "深色主题"}
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>
    </header>
  );
}
