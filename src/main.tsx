import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute, AdminRoute } from "./features/auth/RouteGuards";

const HomePage = lazy(() => import("./routes/index").then((m) => ({ default: m.HomePage })));
const BingoPage = lazy(() => import("./routes/bingo").then((m) => ({ default: m.BingoPage })));
const LearningGamesPage = lazy(() => import("./routes/learning-games").then((m) => ({ default: m.LearningGamesPage })));
const LoginPage = lazy(() => import("./routes/login").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("./routes/dashboard").then((m) => ({ default: m.DashboardPage })));
const SurveyPage = lazy(() => import("./routes/survey").then((m) => ({ default: m.SurveyPage })));
const ActivityAdminPage = lazy(() => import("./routes/admin-activity").then((m) => ({ default: m.ActivityAdminPage })));

function RouteFallback() { return <div className="min-h-screen" aria-label="Loading" />; }

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bingo" element={<BingoPage />} />
            <Route path="/learning-games" element={<LearningGamesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/admin/activity" element={<AdminRoute><ActivityAdminPage /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
