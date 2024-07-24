import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Dashboard from "./Dashboard";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
);
