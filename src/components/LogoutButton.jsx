import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ afterLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof afterLogout === "function") afterLogout();
    navigate("/kirjaudu"); // или "/" если надо
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 22px",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "1rem",
        cursor: "pointer",
        marginBottom: "24px",
        marginLeft: "auto",
        display: "block",
        marginRight: "0"
      }}
    >
      Kirjaudu ulos
    </button>
  );
};

export default LogoutButton;
