import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const navigate = useNavigate();

  // Если пользователь залогинен — сразу на omatsivut
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/omatsivut");
    }
  }, [navigate]);

  // После успешной регистрации показываем логин и сообщение
  const handleRegisterSuccess = (msg) => {
    setShowRegister(false);
    setRegMessage(msg);
  };

  return (
    <div
      className="login-container"
      style={{
        minHeight: 430,
        transition: "min-height 0.25s"
      }}
    >
      {!showRegister ? (
        <>
          <LoginForm onError={setError} />
          {error && <div className="error-message">{error}</div>}
          {regMessage && <div className="success-message">{regMessage}</div>}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span>Ei tiliä?</span>
            <button
              type="button"
              className="switch-link-btn"
              onClick={() => {
                setShowRegister(true);
                setError("");
                setRegMessage("");
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
          {error && <div className="error-message">{error}</div>}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span>Onko jo tili?</span>
            <button
              type="button"
              className="switch-link-btn"
              onClick={() => {
                setShowRegister(false);
                setError("");
                setRegMessage("");
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
