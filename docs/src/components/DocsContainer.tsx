import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface DocsContainerProps {
  children: React.ReactNode;
}

export const DocsContainer: React.FC<DocsContainerProps> = ({ children }) => {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 pt-24">
        <Sidebar />
        <div className="flex flex-1 flex-col items-start gap-8 px-8 py-12">
          {children}
        </div>
      </div>
    </main>
  );
};
