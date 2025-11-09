import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import projectStructureContent from "./project-structure.md?raw";

export const ProjectStructure: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={projectStructureContent} />
      </div>
    </DocsContainer>
  );
};
