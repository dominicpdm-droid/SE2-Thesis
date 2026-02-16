import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoadingPage from "../components/pages/loadingPage.jsx";
import HomePage from "../pages/homepage.jsx";
import SignUpPage from "../auth/signUpPage.jsx";
import LoginPage from "../auth/loginPage.jsx";

import PageTransitions from "../components/common/pageTransitions.jsx";

export default function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const hasChecked = useRef(false);
  const SERVER_HEALTH = import.meta.env.VITE_SERVER_HEALTH;
  const BACKEND_HEALTH = import.meta.env.VITE_BACKEND_HEALTH;

  useEffect(() => {
    let interval;

    const checkServerStatus = async () => {
      try {
        const [serverRes, backendRes] = await Promise.all([
          fetch(SERVER_HEALTH),
          fetch(BACKEND_HEALTH),
        ]);

        console.log("Server Health Response:", serverRes.ok);
        console.log("Backend Health Response:", backendRes.ok);

        if (serverRes.ok && backendRes.ok) {
          hasChecked.current = true;
          clearInterval(interval);
          if (location.pathname === "/") {
            navigate("/home");
          }
        } else {
          if (location.pathname !== "/") {
            navigate("/");
          }
        }
      } catch (error) {
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
    };

    interval = setInterval(checkServerStatus, 3000);

    checkServerStatus();

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <PageTransitions>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </PageTransitions>
  );
}
