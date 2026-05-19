"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

interface MarkdownContentProps {
  content: string;
  isStreaming?: boolean;
}

export function MarkdownContent({
  content,
  isStreaming,
}: MarkdownContentProps) {
  return (
    <div className="markdown-body prose-sm max-w-none text-[var(--text-primary)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            const text = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock language={match[1]} code={text} />;
            }

            return (
              <code
                className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[0.875em]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <p className="mb-3 last:mb-0 leading-7">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-3 list-disc pl-6">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-3 list-decimal pl-6">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="mb-3 text-xl font-semibold">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-2 text-lg font-semibold">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-2 text-base font-semibold">{children}</h3>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-[var(--accent)] underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="mb-3 border-l-2 border-[var(--border-subtle)] pl-4 text-[var(--text-muted)]">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content || (isStreaming ? " " : "")}
      </ReactMarkdown>
      {isStreaming && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[var(--text-muted)] align-middle" />
      )}
    </div>
  );
}
