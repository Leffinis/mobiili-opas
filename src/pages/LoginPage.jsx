import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState("");
  const [regMessage, setRegMessage] = useState("");

  // После успешной регистрации показываем логин и сообщение
  const handleRegisterSuccess = (msg) => {
    setShowRegister(false);
    setRegMessage(msg);
  };

  return (
    <div className="login-container">
      {!showRegister ? (
        <>
          <LoginForm onError={setError} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {regMessage && <div style={{ color: "green", marginBottom: 10 }}>{regMessage}</div>}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span>Ei tiliä? </span>
            <button
              type="button"
              onClick={() => { setShowRegister(true); setError(""); setRegMessage(""); }}
              style={{
                background: "none",
                color: "#117f23",
                border: "none",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem"
              }}
            >
              Rekisteröidy tästä
            </button>
          </div>
        </>
      ) : (
        <>
          <RegisterForm
            onError={setError}
            onSuccess={handleRegisterSuccess}
          />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span>Onko jo tili?</span>
            <button
              type="button"
              onClick={() => { setShowRegister(false); setError(""); setRegMessage(""); }}
              style={{
                background: "none",
                color: "#0066cc",
                border: "none",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem"
              }}
            >
              Kirjaudu sisään
            </button>
          </div>
        </>
      )}
    </div>
  );
}
