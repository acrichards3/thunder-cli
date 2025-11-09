import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import typescriptContent from "./typescript.md?raw";

export const TypeScript: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={typescriptContent} />
      </div>
    </DocsContainer>
  );
};
