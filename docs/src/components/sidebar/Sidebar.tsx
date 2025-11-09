import React from "react";
import { SidebarContent } from "../sidebar/SidebarContent";

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col gap-8 w-64 py-8 px-4">
      <SidebarContent />
    </aside>
  );
};
