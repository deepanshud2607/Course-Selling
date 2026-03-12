import { useEffect, useState } from 'react';
import { getAllCourses } from '../api';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getAllCourses()
      .then(setCourses)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading courses…</div>;
  if (error)   return <div className="loading">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">All Courses</h1>

      {courses.length === 0
        ? <p style={{ color: 'var(--muted)' }}>No courses available yet.</p>
        : <div className="course-grid">
            {courses.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
      }
    </div>
  );
}
