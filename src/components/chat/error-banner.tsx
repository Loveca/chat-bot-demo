"use client";

interface ErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="mx-4 mt-16 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 shadow-sm md:mx-8">
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded px-2 py-0.5 hover:bg-red-100"
        aria-label="关闭"
      >
        ×
      </button>
    </div>
  );
}
