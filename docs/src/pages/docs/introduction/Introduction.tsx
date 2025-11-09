import introductionContent from "./introduction.md?raw";
import React from "react";
import { DocsContainer } from "../../../components/docsContainer/DocsContainer";
import { Markdown } from "../../../components/markdown/Markdown";

export const Introduction: React.FC = () => {
  return (
    <DocsContainer>
      <Markdown content={introductionContent} />
    </DocsContainer>
  );
};
