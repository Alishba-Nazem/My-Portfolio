import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import ShaderPage from "./shader/ShaderPage";

const isShaderDemo =
  window.location.pathname === "/shader" ||
  window.location.pathname === "/shader/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isShaderDemo ? <ShaderPage /> : <App />}
    <Analytics />
  </React.StrictMode>
);