import React from "react";

interface MarkdownContextType {
  content: string;
}

export const MarkdownContext = React.createContext<MarkdownContextType>({
  content: "",
});

export const useMarkdownContent = () => {
  return React.useContext(MarkdownContext);
};
