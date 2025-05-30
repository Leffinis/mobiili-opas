import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { LanguageContext } from "../components/LanguageContext";

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const navigate = useNavigate();

  // menemme suoraan omasivut sivulle jos token on olemassa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/omatsivut");
    }
  }, [navigate]);
  const { t } = useContext(LanguageContext);

  // rekisteröinnin onnistumisen jälkeen suljemme rekisteröintilomakkeen ja näytämme viestin
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
            <span>{t.tili}</span>
            <button
              type="button"
              className="switch-link-btn"
              onClick={() => {
                setShowRegister(true);
                setError("");
                setRegMessage("");
              }}
            >
              {t.register}
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
            <span>{t.jotili}</span>
            <button
              type="button"
              className="switch-link-btn"
              onClick={() => {
                setShowRegister(false);
                setError("");
                setRegMessage("");
              }}
            >
              {t.kirjaudusisään}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
