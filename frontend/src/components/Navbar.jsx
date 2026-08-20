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
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-sm text-white">C</span>CourseHub</Link>

      <ul className="flex items-center gap-4 text-sm font-medium text-slate-600 sm:gap-6">
        <li><Link className="hover:text-slate-950" to="/">Browse</Link></li>

        {userToken ? ( // user is signed in
          <>
            <li><Link className="hover:text-slate-950" to="/dashboard">My learning</Link></li>
            <li><button className="hover:text-slate-950" onClick={handleUserLogout}>Sign out</button></li>
          </>
        ) : adminToken ? ( // admin is signed in
          <>
            <li><Link className="hover:text-slate-950" to="/admin/dashboard">Seller studio</Link></li>
            <li><button className="hover:text-slate-950" onClick={handleAdminLogout}>Sign out</button></li>
          </>
        ) : (
          <>
            <li><Link className="hover:text-slate-950" to="/user/login">Sign in</Link></li>
            <li><Link className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-700" to="/admin/login">Sell a course</Link></li>
          </>
        )}
      </ul>
      </div>
    </nav>
  );
}
