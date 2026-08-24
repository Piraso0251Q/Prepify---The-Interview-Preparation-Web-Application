import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";
import { AppLayout } from "./components/layout/AppLayout";

import LoginPage    from "./pages/auth/LoginPage";
import SignupPage   from "./pages/auth/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import QuestionBankPage from "./pages/QuestionBankPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import MockInterviewSetupPage from "./pages/MockInterviewSetupPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import AdminPortalPage from "./pages/admin/AdminPortalPage";
import LandingPage from "./pages/LandingPage";
import AccountPage from "./pages/AccountPage";
import SubscriptionPage from "./pages/SubscriptionPage";

import "./styles/globals.css";
import "./styles/animations.css";

// ── Guards ─────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

/** Admin portal: must be logged in + admin + have an active subscription */
const AdminRoute = ({ children }) => {
  const { user, hasActiveSubscription } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  if (!hasActiveSubscription()) return <Navigate to="/subscription" replace />;
  return children;
};

/** Subscription page: must be logged in + admin; skip if already subscribed */
const SubscriptionRoute = ({ children }) => {
  const { user, hasActiveSubscription } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  if (hasActiveSubscription()) return <Navigate to="/admin" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ── Authenticated layout wrapper ────────────────────────────
const LayoutRoute = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

// ── Interview page is full-screen (no sidebar/navbar) ───────
const InterviewRoute = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

// ── App ─────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Root → landing for guests, dashboard for logged-in users */}
      <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />

      {/* Auth */}
      <Route path="/login"  element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

      {/* Main app */}
      <Route path="/dashboard"       element={<LayoutRoute><DashboardPage /></LayoutRoute>} />
      <Route path="/questions"       element={<LayoutRoute><QuestionBankPage /></LayoutRoute>} />
      <Route path="/questions/:id"   element={<LayoutRoute><QuestionDetailPage /></LayoutRoute>} />
      <Route path="/interview/setup" element={<LayoutRoute><MockInterviewSetupPage /></LayoutRoute>} />
      <Route path="/history"         element={<LayoutRoute><HistoryPage /></LayoutRoute>} />
      <Route path="/results/:id"     element={<LayoutRoute><ResultsPage /></LayoutRoute>} />
      <Route path="/account"         element={<LayoutRoute><AccountPage /></LayoutRoute>} />

      {/* Interview (full-screen, no layout) */}
      <Route path="/interview/active" element={<InterviewRoute><MockInterviewPage /></InterviewRoute>} />

      {/* Subscription gate — only for admins without an active plan */}
      <Route path="/subscription" element={<SubscriptionRoute><SubscriptionPage /></SubscriptionRoute>} />

      {/* Admin — only for subscribed admins */}
      <Route path="/admin" element={<AdminRoute><AppLayout><AdminPortalPage /></AppLayout></AdminRoute>} />

      {/* Catch-all → landing for guests */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <InterviewProvider>
            <AppRoutes />
          </InterviewProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
