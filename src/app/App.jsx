import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import { AuthProvider } from "../context/AuthContext";

import "./App.scss";

/** Telas de login e cadastro ocupam a tela inteira, sem a sidebar. */
const FULLSCREEN_ROUTES = ["/login", "/cadastro"];

function AppShell() {
  const location = useLocation();

  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  if (isFullscreen) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notificacoes" element={<NotificationsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
