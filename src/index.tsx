import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./style/gobal.css";    // ← подключили

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode><App /></StrictMode>
);