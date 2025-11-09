import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import introductionContent from "./introduction.md?raw";

export const Introduction: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={introductionContent} />
      </div>
    </DocsContainer>
  );
};
