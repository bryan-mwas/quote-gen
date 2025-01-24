import { RouterProvider } from "@tanstack/react-router";
import { APP_ROUTER } from "./main";

function App() {
  // TODO: Logic to invalidate context.
  return <RouterProvider router={APP_ROUTER} />;
}

export default App;
