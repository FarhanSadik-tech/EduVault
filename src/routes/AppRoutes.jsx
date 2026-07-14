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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/department" element={<Department />} />
          <Route path="/semester" element={<Semester />} />
          <Route path="/course" element={<Course />} />
          <Route path="/coursehub" element={<CourseHub />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/discussion" element={<Discussion />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;