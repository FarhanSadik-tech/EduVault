import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ProtectedRoute from "../components/protected/ProtectedRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Department from "../pages/Department";
import Semester from "../pages/Semester";
import Course from "../pages/Course";
import CourseHub from "../pages/CourseHub";
import Upload from "../pages/Upload";
import Discussion from "../pages/Discussion";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import SemesterCourses from "../pages/SemesterCourses";

// 🔥 যেকোনো পেজ পরিবর্তন হলে অটোমেটিক স্ক্রল একদম উপরে নেওয়ার হেল্পার কম্পোনেন্ট
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* 🚀 এখানে ScrollToTop যুক্ত করা হলো */}
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/department" element={<Department />} />
          <Route path="/semester/:departmentId" element={<Semester />} />
          <Route path="/course" element={<Course />} />
          <Route
            path="/course/:departmentId/:semesterId"
            element={<SemesterCourses />}
          />
          <Route
            path="/coursehub/:departmentId/:courseCode"
            element={<CourseHub />}
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />

          <Route path="/discussion" element={<Discussion />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Phase 11: Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;