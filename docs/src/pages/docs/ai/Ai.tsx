import React from "react";
import aiContent from "./ai.md?raw";
import { DocsContainer } from "../../../components/docsContainer/DocsContainer";
import { Markdown } from "../../../components/markdown/Markdown";

export const Ai: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={aiContent} />
      </div>
    </DocsContainer>
  );
};
