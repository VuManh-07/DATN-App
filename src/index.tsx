import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles/global.scss";

const container = document.getElementById("root");
if (!container) throw new Error("#root is missing from public/index.html");

createRoot(container).render(<App />);
