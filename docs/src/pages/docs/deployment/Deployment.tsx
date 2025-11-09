import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import deploymentContent from "./deployment.md?raw";

export const Deployment: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={deploymentContent} />
      </div>
    </DocsContainer>
  );
};
