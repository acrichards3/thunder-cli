import projectStructureContent from "./project-structure.md?raw";
import React from "react";
import { DocsContainer } from "../../../components/docsContainer/DocsContainer";
import { Markdown } from "../../../components/markdown/Markdown";

export const ProjectStructure: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={projectStructureContent} />
      </div>
    </DocsContainer>
  );
};
