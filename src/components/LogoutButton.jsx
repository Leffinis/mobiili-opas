import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ afterLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof afterLogout === "function") afterLogout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-btn"
    >
      Kirjaudu ulos
    </button>
  );
};

export default LogoutButton;
