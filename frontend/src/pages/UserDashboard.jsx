import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPurchases, userResetPass } from '../api';
import { useAuth } from '../context/AuthContext';

function ResetPasswordForm({ token }) {
  const [form, setForm] = useState({ oldPass: '', newPass: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await userResetPass(form, token);
      setMsg({ text: 'Password updated.', type: 'success' });
      setForm({ oldPass: '', newPass: '' });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 360 }}>
      <div className="form-group">
        <label>Current password</label>
        <input type="password" value={form.oldPass} onChange={set('oldPass')} required />
      </div>
      <div className="form-group">
        <label>New password</label>
        <input type="password" value={form.newPass} onChange={set('newPass')} required
          placeholder="Min 8 chars, 1 uppercase, 1 number" />
      </div>
      <button className="btn btn-dark" disabled={loading}>
        {loading ? 'Saving…' : 'Update password'}
      </button>
      {msg.text && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}
    </form>
  );
}

export default function UserDashboard() {
  const { userToken, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) { navigate('/user/login'); return; } // bounce if not signed in

    getPurchases(userToken)
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [userToken]);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="page">
      <h1 className="page-title">My Dashboard</h1>

      {/* purchased courses */}
      <div className="dash-section">
        <h2 className="section-title">Purchased Courses</h2>

        {courses.length === 0
          ? (
            <div className="empty-state">
              You haven't purchased any courses yet.{' '}
              <Link to="/" style={{ color: 'var(--fg)' }}>Browse courses →</Link>
            </div>
          ) : (
            <div className="course-grid">
              {courses.map(c => (
                <div key={c._id} className="course-card">
                  {c.imageURL
                    ? <img src={c.imageURL} alt={c.title} />
                    : <div className="course-card-img-placeholder">No image</div>
                  }
                  <div className="course-card-body">
                    <p className="course-card-title">{c.title}</p>
                    <p className="course-card-price">${c.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* password change */}
      <div className="dash-section">
        <h2 className="section-title">Change Password</h2>
        <ResetPasswordForm token={userToken} />
      </div>

      <button
        className="btn btn-outline btn-sm"
        onClick={() => { logoutUser(); navigate('/'); }}
        style={{ marginTop: '0.5rem' }}
      >
        Sign out
      </button>
    </div>
  );
}
