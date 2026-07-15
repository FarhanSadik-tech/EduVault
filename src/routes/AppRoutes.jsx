import ProtectedRoute from "../components/protected/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function AppRoutes() {
  return (
    <BrowserRouter>
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
          <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;