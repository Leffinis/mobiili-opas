import React from "react";
import ReactDOM from "react-dom/client";
import App from "/src/pages/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./components/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);