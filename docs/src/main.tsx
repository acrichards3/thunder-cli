import "./index.css";
import React from "react";
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router"; // prettier-ignore
import { Introduction } from "./pages/docs/introduction/Introduction";
import { GettingStarted } from "./pages/docs/getting-started/GettingStarted";
import { ProjectStructure } from "./pages/docs/project-structure/ProjectStructure";
import { Recommendations } from "./pages/docs/recommendations/Recommendations";
import { FirstSteps } from "./pages/docs/first-steps/FirstSteps";
import { TypeScript } from "./pages/docs/typescript/TypeScript";
import { Vite } from "./pages/docs/vite/Vite";
import { Bun } from "./pages/docs/bun/Bun";
import { Drizzle } from "./pages/docs/drizzle/Drizzle";
import { AuthJs } from "./pages/docs/authjs/AuthJs";
import { Deployment } from "./pages/docs/deployment/Deployment";
import { NotFound } from "./pages/NotFound";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

const rootRoute = createRootRoute({
  notFoundComponent: NotFound,
});

const routes = {
  authjs: createRoute({
    component: AuthJs,
    getParentRoute: () => rootRoute,
    path: "/authjs",
  }),
  bun: createRoute({
    component: Bun,
    getParentRoute: () => rootRoute,
    path: "/bun",
  }),
  deployment: createRoute({
    component: Deployment,
    getParentRoute: () => rootRoute,
    path: "/deployment",
  }),
  drizzle: createRoute({
    component: Drizzle,
    getParentRoute: () => rootRoute,
    path: "/drizzle",
  }),
  firstSteps: createRoute({
    component: FirstSteps,
    getParentRoute: () => rootRoute,
    path: "/first-steps",
  }),
  gettingStarted: createRoute({
    component: GettingStarted,
    getParentRoute: () => rootRoute,
    path: "/getting-started",
  }),
  home: createRoute({
    component: App,
    getParentRoute: () => rootRoute,
    path: "/",
  }),
  introduction: createRoute({
    component: Introduction,
    getParentRoute: () => rootRoute,
    path: "/introduction",
  }),
  projectStructure: createRoute({
    component: ProjectStructure,
    getParentRoute: () => rootRoute,
    path: "/project-structure",
  }),
  recommendations: createRoute({
    component: Recommendations,
    getParentRoute: () => rootRoute,
    path: "/recommendations",
  }),
  typescript: createRoute({
    component: TypeScript,
    getParentRoute: () => rootRoute,
    path: "/typescript",
  }),
  vite: createRoute({
    component: Vite,
    getParentRoute: () => rootRoute,
    path: "/vite",
  }),
} as const;

const routeTree = rootRoute.addChildren(routes);
const router = createRouter({ routeTree });

createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
