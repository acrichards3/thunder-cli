import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import recommendationsContent from "./recommendations.md?raw";

export const Recommendations: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={recommendationsContent} />
      </div>
    </DocsContainer>
  );
};
