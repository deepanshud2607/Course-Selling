import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminCourses, createCourse, updateCourse, deleteCourse, adminResetPass } from '../api';
import { useAuth } from '../context/AuthContext';

// ── Small reusable message ───────────────────────────
function Msg({ text, type }) {
  if (!text) return null;
  return <div className={`msg msg-${type}`}>{text}</div>;
}

// ── Course form used for both create and edit ────────
function CourseForm({ initial = {}, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    title:       initial.title       || '',
    description: initial.description || '',
    price:       initial.price       || '',
    imageURL:    initial.imageURL    || '',
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      await onSave({ ...form, price: Number(form.price) });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label>Title</label>
        <input value={form.title} onChange={set('title')} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={form.description} onChange={set('description')} required
          placeholder="At least 30 characters" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price ($)</label>
          <input type="number" min="0" value={form.price} onChange={set('price')} required />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="url" value={form.imageURL} onChange={set('imageURL')} required />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button className="btn btn-dark" disabled={loading}>
          {loading ? 'Saving…' : 'Save course'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
      <Msg {...msg} />
    </form>
  );
}

// ── Edit modal ───────────────────────────────────────
function EditModal({ course, token, onDone, onClose }) {
  const [loading, setLoading] = useState(false);

  async function save(data) {
    setLoading(true);
    await updateCourse(course._id, data, token); // throws on error
    setLoading(false);
    onDone();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit course</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <CourseForm initial={course} onSave={save} onCancel={onClose} loading={loading} />
      </div>
    </div>
  );
}

// ── Reset password section ───────────────────────────
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
      await adminResetPass(form, token);
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
      <Msg {...msg} />
    </form>
  );
}

// ── Main dashboard ───────────────────────────────────
export default function AdminDashboard() {
  const { adminToken, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [creating,   setCreating]   = useState(false);
  const [editTarget, setEditTarget] = useState(null); // the course being edited
  const [deleting,   setDeleting]   = useState(null); // id being deleted
  const [listMsg,    setListMsg]    = useState({ text: '', type: '' });

  useEffect(() => {
    if (!adminToken) { navigate('/admin/login'); return; }
    fetchCourses();
  }, [adminToken]);

  function fetchCourses() {
    setLoading(true);
    getAdminCourses(adminToken)
      .then(setCourses)
      .catch(err => setListMsg({ text: err.message, type: 'error' }))
      .finally(() => setLoading(false));
  }

  async function handleCreate(data) {
    await createCourse(data, adminToken); // throws on failure
    setCreating(false);
    fetchCourses();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this course?')) return;
    setDeleting(id);
    try {
      await deleteCourse(id, adminToken);
      setCourses(cs => cs.filter(c => c._id !== id));
    } catch (err) {
      setListMsg({ text: err.message, type: 'error' });
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="page">
      <h1 className="page-title">Admin Dashboard</h1>

      {/* course list */}
      <div className="dash-section">
        <h2 className="section-title">Your Courses</h2>
        <Msg {...listMsg} />

        {courses.length === 0
          ? <div className="empty-state">You haven't added any courses yet.</div>
          : courses.map(c => (
            <div key={c._id} className="admin-course-item">
              {c.imageURL
                ? <img src={c.imageURL} alt={c.title} className="admin-course-thumb" />
                : <div className="admin-course-thumb" />
              }
              <div className="admin-course-info">
                <strong>{c.title}</strong>
                <span>${c.price}</span>
              </div>
              <div className="admin-course-actions">
                <button className="btn btn-outline btn-sm" onClick={() => setEditTarget(c)}>Edit</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c._id)}
                  disabled={deleting === c._id}
                >
                  {deleting === c._id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* add course */}
      <div className="dash-section">
        <h2 className="section-title">
          {creating ? 'New Course' : 'Add a Course'}
        </h2>

        {creating
          ? <CourseForm onSave={handleCreate} onCancel={() => setCreating(false)} loading={false} />
          : <button className="btn btn-dark btn-sm" onClick={() => setCreating(true)}>+ New course</button>
        }
      </div>

      {/* password change */}
      <div className="dash-section">
        <h2 className="section-title">Change Password</h2>
        <ResetPasswordForm token={adminToken} />
      </div>

      <button
        className="btn btn-outline btn-sm"
        onClick={() => { logoutAdmin(); navigate('/'); }}
        style={{ marginTop: '0.5rem' }}
      >
        Sign out
      </button>

      {/* edit modal renders on top when a course is selected */}
      {editTarget && (
        <EditModal
          course={editTarget}
          token={adminToken}
          onDone={() => { setEditTarget(null); fetchCourses(); }}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
