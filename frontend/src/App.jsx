import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar        from './components/Navbar';
import Home          from './pages/Home';
import CoursePreview from './pages/CoursePreview';
import UserAuth      from './pages/UserAuth';
import AdminAuth     from './pages/AdminAuth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/course/:id"     element={<CoursePreview />} />

        {/* user auth — default tab determined by which path was hit */}
        <Route path="/user/login"  element={<UserAuth defaultTab="login"  />} />
        <Route path="/user/signup" element={<UserAuth defaultTab="signup" />} />

        {/* admin auth */}
        <Route path="/admin/login"  element={<AdminAuth defaultTab="login"  />} />
        <Route path="/admin/signup" element={<AdminAuth defaultTab="signup" />} />

        <Route path="/dashboard"        element={<UserDashboard />} />
        <Route path="/admin/dashboard"  element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} /> {/* catch-all */}
      </Routes>
    </>
  );
}
