import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import gettingStartedContent from "./getting-started.md?raw";

export const GettingStarted: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={gettingStartedContent} />
      </div>
    </DocsContainer>
  );
};
