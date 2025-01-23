import { createRootRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import App from "../App";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <App />
    </Fragment>
  );
}
