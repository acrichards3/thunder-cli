import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import firstStepsContent from "./first-steps.md?raw";

export const FirstSteps: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={firstStepsContent} />
      </div>
    </DocsContainer>
  );
};
