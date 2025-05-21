// src/components/LogoutButton.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "./LanguageContext";

export default function LogoutButton({ afterLogout }) {
  const { t } = useContext(LanguageContext);  // ← здесь вызов useContext
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof afterLogout === "function") afterLogout();
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      {t.kirjauduulos}
    </button>
  );
}
