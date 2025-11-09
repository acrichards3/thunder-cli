import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import drizzleContent from "./drizzle.md?raw";

export const Drizzle: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={drizzleContent} />
      </div>
    </DocsContainer>
  );
};
