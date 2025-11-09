import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import viteContent from "./vite.md?raw";

export const Vite: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={viteContent} />
      </div>
    </DocsContainer>
  );
};
