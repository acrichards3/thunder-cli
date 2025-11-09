import React from "react";
import recommendationsContent from "./recommendations.md?raw";
import { DocsContainer } from "../../../components/docsContainer/DocsContainer";
import { Markdown } from "../../../components/markdown/Markdown";

export const Recommendations: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={recommendationsContent} />
      </div>
    </DocsContainer>
  );
};
