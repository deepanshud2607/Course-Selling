import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userLogin, userSignup } from '../api';
import { useAuth } from '../context/AuthContext';

// shared by the login and signup forms below
function Msg({ text, type }) {
  if (!text) return null;
  return <div className={`msg msg-${type}`}>{text}</div>;
}

function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const data = await userLogin(form);
      onSuccess(data.authorization);
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={form.email} onChange={set('email')} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={form.password} onChange={set('password')} required />
      </div>
      <button className="btn btn-dark btn-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <Msg {...msg} />
    </form>
  );
}

function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await userSignup(form);
      setMsg({ text: 'Account created. You can now sign in.', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <div className="form-group">
          <label>First name</label>
          <input value={form.firstName} onChange={set('firstName')} required />
        </div>
        <div className="form-group">
          <label>Last name</label>
          <input value={form.lastName} onChange={set('lastName')} required />
        </div>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={form.email} onChange={set('email')} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={form.password} onChange={set('password')} required
          placeholder="Min 8 chars, 1 uppercase, 1 number" />
      </div>
      <button className="btn btn-dark btn-full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <Msg {...msg} />
    </form>
  );
}

export default function UserAuth({ defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  function onLoginSuccess(token) {
    loginUser(token);
    navigate('/dashboard');
  }

  return (
    <div className="page-narrow">
      <div className="form-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login'  ? 'active' : ''}`} onClick={() => setTab('login')}>Sign in</button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Create account</button>
        </div>

        {tab === 'login'
          ? <LoginForm  onSuccess={onLoginSuccess} />
          : <SignupForm onSuccess={() => setTab('login')} />
        }

        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Are you a course creator? <Link to="/admin/login" style={{ color: 'var(--fg)' }}>Admin sign in →</Link>
        </p>
      </div>
    </div>
  );
}
