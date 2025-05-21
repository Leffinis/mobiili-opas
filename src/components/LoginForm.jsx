import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    onError(""); 
    try {
      const resp = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        onError(data.error || "Virhe");
        return;
      }
      localStorage.setItem("token", data.token);
      alert("Kirjautuminen onnistui!");
      navigate("/omatsivut");
    } catch {
      onError("Verkkovirhe!");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2 className="login-title">Kirjaudu sisään</h2>
      <div className="form-group">
        <label htmlFor="login-username">Käyttäjätunnus</label>
        <input
          type="text"
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Salasana</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <button type="submit" className="login-button">Kirjaudu</button>
    </form>
  );
};

export default LoginForm;
