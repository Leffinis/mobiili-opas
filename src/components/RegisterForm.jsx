import React, { useState, useContext } from "react";
import { LanguageContext } from "./LanguageContext";


const RegisterForm = ({ onError, onSuccess }) => {
  const { t } = useContext(LanguageContext);
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
      <h2 className="login-title">{t.register}</h2>
      <div className="form-group">
        <label htmlFor="reg-username">{t.käyttäjätunnus}</label>
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
        <label htmlFor="reg-password">{t.salasana}</label>
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
        {t.register}
      </button>
    </form>
  );
};

export default RegisterForm;
