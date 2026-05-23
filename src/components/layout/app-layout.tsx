interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  onCloseSidebar: () => void;
}

export function AppLayout({
  sidebar,
  children,
  isSidebarOpen,
  isSidebarCollapsed,
  onCloseSidebar,
}: AppLayoutProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="关闭侧边栏"
          onClick={onCloseSidebar}
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-[1px] md:hidden"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSidebarCollapsed ? "md:w-[76px]" : "md:w-[304px]"}`}
      >
        {sidebar}
      </div>
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
