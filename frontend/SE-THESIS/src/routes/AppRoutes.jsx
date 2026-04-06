import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingPage from "../features/pages/loadingPage";
import HomePage from "../features/pages/homepage";
import ClassroomPage from "../features/pages/classroomPage"
import SignUpPage from "../features/auth/signUpPage";
import LoginPage from "../features/auth/loginPage";
import DashboardPage from "../features/pages/dashboardPage";
import ActivityPage from "../features/pages/activityPage";
import AnalyticsPage from "../features/pages/analyticsPage";
import NotificationPage from "../features/pages/notificationPage";
import DevelopmentPage from "../features/pages/developmentPage";
import ProfilePage from "../features/pages/profilePage";
import Layout from "../shared/components/layouts/layout";

import PageTransitions from "../shared/components/animations/pageTransitions";

export default function AppRoutes() {;

  // TODO: Add comments for debugging
  // TODO: Fix check health to only send once
  // !Done! Made a wrapper for this.
  // TODO: Maybe move the check health to service component ¯\_(ツ)_/¯
  // !Also Done! Move it in services folder as healthService.js (　´∀｀)b

  return (
    <Routes element={<PageTransitions />}>
      <Route path="/" element={<LoadingPage />} />
      <Route path="/iris" element={<HomePage />} />
      <Route path="/iris/login" element={<LoginPage />} />
      <Route path="/iris/signup" element={<SignUpPage />} />
      <Route path="/iris/profile" element={<ProfilePage />} />

      <Route path="iris" element={<Layout />}>
        <Route path="/iris/home" element={<DashboardPage />} />
        <Route path="/iris/room_management" element={<ClassroomPage />} />
        <Route path="/iris/activity" element={<ActivityPage />} />
        <Route path="/iris/development" element={<DevelopmentPage />} />
        <Route path="/iris/analytics" element={<AnalyticsPage />} />
        <Route path="/iris/notifications" element={<NotificationPage />} />
      </Route>
    </Routes>
  );
}
