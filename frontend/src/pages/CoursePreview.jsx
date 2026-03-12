import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCoursePreview, purchaseCourse } from '../api';
import { useAuth } from '../context/AuthContext';

export default function CoursePreview() {
  const { id } = useParams();
  const { userToken } = useAuth();
  const navigate = useNavigate();

  const [course,    setCourse]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [buying,    setBuying]    = useState(false);
  const [msg,       setMsg]       = useState({ text: '', type: '' });

  useEffect(() => {
    getCoursePreview(id)
      .then(setCourse)
      .catch(err => setMsg({ text: err.message, type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  async function handlePurchase() {
    if (!userToken) { navigate('/user/login'); return; }
    setBuying(true);
    setMsg({ text: '', type: '' });
    try {
      await purchaseCourse(id, userToken);
      setMsg({ text: 'Course purchased! Find it in your dashboard.', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setBuying(false);
    }
  }

  if (loading) return <div className="loading">Loading…</div>;
  if (!course) return <div className="loading">Course not found.</div>;

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to all courses</Link>

      <div className="preview-layout">
        <div>
          {course.imageURL
            ? <img src={course.imageURL} alt={course.title} className="preview-image" />
            : <div className="preview-image-placeholder">No image</div>
          }

          <h1 className="preview-title" style={{ marginTop: '1.25rem' }}>{course.title}</h1>
          <p className="preview-desc">{course.description}</p>
        </div>

        <div className="preview-sidebar">
          <p className="preview-price">${course.price}</p>

          <button
            className="btn btn-dark btn-full"
            onClick={handlePurchase}
            disabled={buying}
          >
            {buying ? 'Processing…' : userToken ? 'Purchase' : 'Sign in to purchase'}
          </button>

          {!userToken && ( // nudge them to sign up
            <Link to="/user/signup">
              <button className="btn btn-outline btn-full">Create account</button>
            </Link>
          )}

          {msg.text && (
            <div className={`msg msg-${msg.type === 'error' ? 'error' : 'success'}`}>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
