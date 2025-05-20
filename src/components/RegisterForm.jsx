import React, { useState } from "react";

const RegisterForm = ({ onError, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    onError(""); onSuccess("");
    if (!username || !password) {
      onError("Täytä kaikki kentät");
      return;
    }
    try {
      const resp = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        onError(data.error || "Rekisteröinti epäonnistui");
        return;
      }
      onSuccess("Rekisteröinti onnistui! Nyt voit kirjautua sisään.");
      setUsername(""); setPassword("");
    } catch {
      onError("Verkkovirhe!");
    }
  };

  return (
    <form onSubmit={handleRegister} className="login-form" style={{ marginTop: 30 }}>
      <h2 className="login-title">Rekisteröidy</h2>
      <div className="form-group">
        <label htmlFor="reg-username">Käyttäjätunnus</label>
        <input
          type="text"
          id="reg-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reg-password">Salasana</label>
        <input
          type="password"
          id="reg-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <button type="submit" className="login-button" style={{ backgroundColor: "#117f23" }}>
        Rekisteröidy
      </button>
    </form>
  );
};

export default RegisterForm;
