import React from "react";
import typescriptContent from "./typescript.md?raw";
import { DocsContainer } from "../../../components/docsContainer/DocsContainer";
import { Markdown } from "../../../components/markdown/Markdown";

export const TypeScript: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={typescriptContent} />
      </div>
    </DocsContainer>
  );
};
