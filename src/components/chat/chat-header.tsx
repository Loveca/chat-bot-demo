interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-[var(--border-subtle)] px-4 md:px-6">
      <h2 className="truncate text-sm font-medium text-[var(--text-primary)]">
        {title}
      </h2>
    </header>
  );
}
