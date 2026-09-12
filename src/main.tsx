import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n";
import "./styles.css";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./features/auth/RouteGuards";

const HomePage = lazy(() => import("./routes/index").then((m) => ({ default: m.HomePage })));
const BingoPage = lazy(() => import("./routes/bingo").then((m) => ({ default: m.BingoPage })));
const SobprabLacLabPage = lazy(() => import("./routes/sobprab-lac-lab").then((m) => ({ default: m.SobprabLacLabPage })));
const LoginPage = lazy(() => import("./routes/login").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("./routes/dashboard").then((m) => ({ default: m.DashboardPage })));
const SurveyPage = lazy(() => import("./routes/survey").then((m) => ({ default: m.SurveyPage })));
const LacPage = lazy(() => import("./routes/lac-page").then((m) => ({ default: m.LacPage })));
const LacApplicationPage = lazy(() => import("./routes/lac-application").then((m) => ({ default: m.LacApplicationPage })));

function RouteFallback() { return <div className="min-h-screen" aria-label="Loading" />; }

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lac/application" element={<LacApplicationPage />} />
            <Route path="/lac/:slug" element={<LacPage />} />
            <Route path="/sobprab-lac-lab" element={<SobprabLacLabPage />} />
            <Route path="/bingo" element={<BingoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
