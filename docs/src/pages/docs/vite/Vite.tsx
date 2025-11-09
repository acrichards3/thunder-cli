import React from "react";
import viteContent from "./vite.md?raw";
import { DocsContainer } from "../../../components/docsContainer/DocsContainer";
import { Markdown } from "../../../components/markdown/Markdown";

export const Vite: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={viteContent} />
      </div>
    </DocsContainer>
  );
};
