import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { userToken, adminToken, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  function handleUserLogout() {
    logoutUser();
    navigate('/');
  }

  function handleAdminLogout() {
    logoutAdmin();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">CourseHub</Link>

      <ul className="navbar-links">
        <li><Link to="/">Browse</Link></li>

        {userToken ? ( // user is signed in
          <>
            <li><Link to="/dashboard">My Courses</Link></li>
            <li><button onClick={handleUserLogout}>Sign out</button></li>
          </>
        ) : adminToken ? ( // admin is signed in
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><button onClick={handleAdminLogout}>Sign out</button></li>
          </>
        ) : (
          <>
            <li><Link to="/user/login">Sign in</Link></li>
            <li><Link to="/admin/login">Admin</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
