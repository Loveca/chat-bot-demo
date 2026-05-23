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
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-16 items-center gap-3 px-4 md:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-lg text-[var(--text-primary)] shadow-sm transition hover:bg-[var(--bg-hover)] md:hidden"
        aria-label="打开侧边栏"
        title="打开侧边栏"
      >
        ≡
      </button>

      <h2 className="pointer-events-auto min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-muted)] md:max-w-[360px]">
        {title}
      </h2>

      <div className="pointer-events-auto ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onStreamToggle}
          className={`hidden h-9 items-center rounded-full border px-3 text-xs font-medium transition sm:flex ${
            streamMode
              ? "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              : "border-[var(--accent-soft)] bg-[var(--accent-faint)] text-[var(--accent)]"
          }`}
          aria-label={streamMode ? "切换到非流式调试模式" : "切换到流式模式"}
          title={streamMode ? "流式模式" : "调试模式"}
        >
          {streamMode ? "流式" : "调试"}
        </button>
        <select
          value={model}
          onChange={(event) => onModelChange(event.target.value as ChatModel)}
          className="h-9 max-w-[168px] rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] outline-none transition hover:bg-[var(--bg-hover)] focus:border-[var(--border-focus)]"
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
          onClick={onThemeToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
          aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
          title={theme === "dark" ? "浅色主题" : "深色主题"}
        >
          {theme === "dark" ? "☼" : "☾"}
        </button>
      </div>
    </header>
  );
}
