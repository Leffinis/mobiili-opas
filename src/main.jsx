import React from "react";
import ReactDOM from "react-dom/client";
import App from "/src/pages/App.jsx";
import { LanguageProvider } from "./components/LanguageContext"; // Импортируем LanguageProvider
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider> {/* Оборачиваем App в LanguageProvider */}
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
