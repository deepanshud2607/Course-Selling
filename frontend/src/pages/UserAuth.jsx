import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { googleLogin, userLogin, userSignup } from '../api';
import { useAuth } from '../context/AuthContext';

const input = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100';
const label = 'text-sm font-medium text-slate-700';

function GoogleButton({ onSuccess }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!clientId) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client'; script.async = true;
    script.onload = () => window.google?.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }) => {
      try { const data = await googleLogin(credential); onSuccess(data.authorization); }
      catch (err) { setMessage(err.message); }
    }});
    document.head.appendChild(script);
    return () => script.remove();
  }, [clientId]);
  function signIn() { if (!clientId) return setMessage('Add VITE_GOOGLE_CLIENT_ID to the frontend .env to enable Google sign-in.'); window.google?.accounts.id.prompt(); }
  return <><button type="button" onClick={signIn} className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.23-.2-1.77H12v3.35h5.37a4.6 4.6 0 0 1-1.99 3.02l2.89 2.24c1.69-1.56 2.68-3.86 2.68-6.84Z"/><path fill="#34A853" d="M12 21.72c2.62 0 4.82-.86 6.42-2.34l-2.89-2.24c-.8.54-1.83.86-3.03.86-2.53 0-4.68-1.7-5.45-4l-2.98 2.3c1.59 3.15 4.85 5.42 7.93 5.42Z"/><path fill="#FBBC05" d="M7.05 14c-.2-.54-.32-1.12-.32-1.72s.11-1.18.31-1.72l-2.98-2.3A9.7 9.7 0 0 0 3 12.28c0 1.56.38 3.03 1.06 4.3L7.05 14Z"/><path fill="#EA4335" d="M12 6.56c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.81 3.63 14.61 2.65 12 2.65c-3.99 0-7.35 2.28-8.95 5.61l2.98 2.3c.77-2.3 2.92-4 5.97-4Z"/></svg>Login with Google</button>{message && <p className="mt-2 text-xs text-amber-700">{message}</p>}</>;
}

export default function UserAuth({ defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab); const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false); const [message, setMessage] = useState('');
  const { loginUser } = useAuth(); const navigate = useNavigate(); const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  async function submit(e) { e.preventDefault(); setLoading(true); setMessage(''); try { if (tab === 'signup') { await userSignup(form); setTab('login'); setMessage('Account created. Sign in to continue.'); } else { const data = await userLogin(form); loginUser(data.authorization); navigate('/dashboard'); } } catch (err) { setMessage(err.message); } finally { setLoading(false); } }
  function onGoogleSuccess(token) { loginUser(token); navigate('/dashboard'); }
  return <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2"><section className="hidden lg:block"><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo-600">CourseHub</p><h1 className="mt-4 max-w-md text-5xl font-bold tracking-tight">Learn at your own pace.</h1><p className="mt-5 max-w-md text-lg text-slate-600">One clean place for every course you own.</p></section><section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8"><p className="text-sm font-semibold text-indigo-600">WELCOME</p><h2 className="mt-1 text-2xl font-bold">{tab === 'login' ? 'Sign in to CourseHub' : 'Create your account'}</h2><div className="mt-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1"><button onClick={() => setTab('login')} className={`rounded-md py-2 text-sm font-semibold ${tab === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Sign in</button><button onClick={() => setTab('signup')} className={`rounded-md py-2 text-sm font-semibold ${tab === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Create account</button></div><form className="mt-6 space-y-4" onSubmit={submit}>{tab === 'signup' && <div className="grid gap-4 sm:grid-cols-2"><label className={label}>First name<input className={input} value={form.firstName} onChange={set('firstName')} required /></label><label className={label}>Last name<input className={input} value={form.lastName} onChange={set('lastName')} required /></label></div>}<label className={label}>Email<input className={input} type="email" value={form.email} onChange={set('email')} required /></label><label className={label}>Password<input className={input} type="password" placeholder={tab === 'signup' ? '8+ characters, uppercase and number' : ''} value={form.password} onChange={set('password')} required /></label><button disabled={loading} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">{loading ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}</button></form>{message && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${message.startsWith('Account') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{message}</p>}<div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>OR<span className="h-px flex-1 bg-slate-200"/></div><GoogleButton onSuccess={onGoogleSuccess}/><p className="mt-6 text-center text-sm text-slate-500">Want to sell courses? <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to="/admin/login">Seller sign in</Link></p></section></main>;
}
