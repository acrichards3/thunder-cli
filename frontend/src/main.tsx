import "./index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@hono/auth-js/react";
import { EnvError } from "./components/EnvError";
import { envIssues } from "./env/env";
import { raise } from "@thunder-app/lib";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root") ?? raise("Root element not found"));

if (envIssues.length > 0) {
  root.render(
    <React.StrictMode>
      <EnvError issues={envIssues} />
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <App />
        </SessionProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
