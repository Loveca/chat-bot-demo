interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--bg-main)]">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
