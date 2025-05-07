import React, { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "salasana123") {
      alert("Kirjautuminen onnistui!");
      // Здесь можно добавить навигацию или setAuth(true)
    } else {
      alert("Väärä käyttäjätunnus tai salasana");
    }
  };

  return (
    <div className="app-wrapper">
      <main className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="login-title">Kirjaudu sisään</h2>
          <div className="form-group">
            <label htmlFor="username">Käyttäjätunnus</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Kirjaudu</button>
        </form>
      </main>
    </div>
  );
}
