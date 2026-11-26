import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";

import LandingLayout from "../../layouts/landing/LandingLayout";
import AuthLayout from "../../layouts/auth/AuthLayout";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";
import AdminLayout from "../../layouts/admin/AdminLayout";

import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

/* Landing */
import HomePage from "../../pages/landing/home/HomePage";
import QuizManagementPage from "../../pages/admin/quiz/QuizManagementPage";
import EmployeeQuizPage from "../../pages/training/quiz/EmployeeQuizPage";
import CertificatesPage from "../../pages/training/certificates/CertificatesPage";
import ProfileSettingsPage from "../../pages/profile/ProfileSettingsPage";
import PhishingSimulatorPage from "../../pages/phishing/PhishingSimulatorPage";
/* Auth */
import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import OTPVerificationPage from "../../pages/auth/OTPVerificationPage";
import ResetPasswordPage from "../../pages/auth/reset-password/ResetPasswordPage";
import AdminLoginPage from "../../pages/auth/AdminLoginPage";
import AdminSignupPage from "../../pages/auth/AdminSignupPage";

/* Employee */
import DashboardPage from "../../pages/dashboard/DashboardPage";
import AllCoursesPage from "../../pages/training/all-courses/AllCoursesPage";
import CourseDetailsPage from "../../pages/training/course-details/CourseDetailsPage";
import ModulePlayerPage from "../../pages/training/module-player/ModulePlayerPage";
// ================= ADMIN PAGES =================
import AdminDashboardPage from "../../pages/admin/dashboard/AdminDashboardPage";

/* Admin */

import CoursesManagementPage from "../../pages/admin/courses/CoursesManagementPage";
import LessonManagementPage from "../../pages/admin/lessons/LessonManagementPage";
import AdminUsersPage from "../../pages/admin/users/AdminUsersPage";
import AdminPhishingCampaignsPage from "../../pages/admin/phishing-campaigns/AdminPhishingCampaignsPage";
import AdminAnalyticsPage from "../../pages/admin/analytics/AdminAnalyticsPage";
import AdminSettingsPage from "../../pages/admin/settings/AdminSettingsPage";

/* Temporary Pages */
const Placeholder = ({ title }: { title: string }) => (
  <PlaceholderContent title={title} />
);

function PlaceholderContent({ title }: { title: string }) {
  const { t } = useTranslation();
  const titleKeys: Record<string, string> = {
    "Quiz History": "quizHistory",
    "Password Lab": "passwordLab",
    "Leaderboard": "leaderboard",
    Notifications: "notifications",
    "Incident Reports": "incidents",
    Policies: "policies",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white text-3xl font-bold">
      {t(titleKeys[title] ?? title)}
    </div>
  );
}

/* ==========================================================
   PROTECTED ROUTE
========================================================== */

function ProtectedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-slate-400">
            {t("loadingCyberAware")}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return children;
}

/* ==========================================================
   ADMIN ROUTE
========================================================== */

function AdminRoute({
  children,
}: {
  children: ReactElement;
}) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading Admin Workspace...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}

/* ==========================================================
   APP ROUTER
========================================================== */

export default function AppRouter() {
  return (
    <Routes>
      {/* ======================================================
          LANDING
      ====================================================== */}

      <Route element={<LandingLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* ======================================================
          AUTH
      ====================================================== */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* ======================================================
          EMPLOYEE ROUTES
      ====================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="training" element={<AllCoursesPage />} />

        <Route
  path="training/course-details/:courseId"
  element={<CourseDetailsPage />}
/>

        <Route
          path="training/module/:lessonId"
          element={<ModulePlayerPage />}
        />

        <Route
          path="/quiz/lesson/:lessonId"
          element={<EmployeeQuizPage />}
        />

        <Route
          path="/quiz/history"
          element={<Placeholder title="Quiz History" />}
        />

        <Route
          path="/password-lab"
          element={<Placeholder title="Password Lab" />}
        />

        <Route
          path="/leaderboard"
          element={<Placeholder title="Leaderboard" />}
        />

        <Route
          path="/certificates"
          element={<CertificatesPage />}
        />

        <Route
          path="/notifications"
          element={<Placeholder title="Notifications" />}
        />

        <Route
          path="/profile"
          element={<ProfileSettingsPage />}
        />

        <Route
          path="/settings"
          element={<Navigate to="/profile" replace />}
        />

        <Route
          path="/phishing"
          element={<PhishingSimulatorPage />}
        />

        <Route
          path="/incidents"
          element={<Placeholder title="Incident Reporting" />}
        />

        <Route
          path="/policies"
          element={<Placeholder title="Security Policies" />}
        />
      </Route>

      {/* ======================================================
          ADMIN ROUTES
      ====================================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={<AdminDashboardPage />}
        />
<Route
  path="/admin/modules/:moduleId/quizzes"
  element={<QuizManagementPage />}
/>
        {/* Courses */}
        <Route
          path="courses"
          element={<CoursesManagementPage />}
        />

        <Route
          path="courses/:moduleId/lessons"
          element={<LessonManagementPage />}
        />
        <Route
  path="courses/:moduleId/quizzes"
  element={<QuizManagementPage />}
/>

        {/* Users */}
        <Route
          path="users"
          element={<AdminUsersPage />}
        />

        {/* Phishing */}
        <Route
          path="phishing-campaigns"
          element={<AdminPhishingCampaignsPage />}
        />

        {/* Analytics */}
        <Route
          path="analytics"
          element={<AdminAnalyticsPage />}
        />

        {/* Leaderboard */}
        <Route
          path="leaderboard"
          element={<Placeholder title="Leaderboard" />}
        />

        {/* Settings */}
        <Route
          path="settings"
          element={<AdminSettingsPage />}
        />
      </Route>

      {/* ======================================================
          REDIRECTS
      ====================================================== */}

      <Route
        path="/home"
        element={<Navigate replace to="/" />}
      />

      <Route
        path="*"
        element={<Navigate replace to="/" />}
      />
    </Routes>
  );
}