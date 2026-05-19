declare module "react-syntax-highlighter" {
  import type { ComponentType, ReactNode } from "react";

  interface SyntaxHighlighterProps {
    children?: ReactNode;
    language?: string;
    style?: Record<string, unknown>;
    customStyle?: Record<string, string | number>;
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const oneLight: Record<string, unknown>;
}
