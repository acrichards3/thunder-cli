import React from "react";
import { DocsContainer } from "../../../components/DocsContainer";
import { Markdown } from "../../../components/Markdown";
import authjsContent from "./authjs.md?raw";

export const AuthJs: React.FC = () => {
  return (
    <DocsContainer>
      <div className="flex flex-col gap-4 max-w-4xl">
        <Markdown content={authjsContent} />
      </div>
    </DocsContainer>
  );
};
