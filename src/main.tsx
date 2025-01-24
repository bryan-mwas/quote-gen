import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import App from "./App.tsx";

export const APP_ROUTER = createRouter({
  routeTree: routeTree,
  context: {
    authUser: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof APP_ROUTER;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
