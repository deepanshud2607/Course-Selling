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

  if (loading) return <div className="py-24 text-center text-slate-500">Loading courses…</div>;
  if (error)   return <div className="py-24 text-center text-rose-600">{error}</div>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">Learn without limits</p>
        <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Find your next practical skill.</h1>
        <p className="mt-4 max-w-lg text-slate-300">Focused courses made by independent experts.</p>
      </section>
      <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-medium text-indigo-600">EXPLORE</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Available courses</h2></div><span className="text-sm text-slate-500">{courses.length} courses</span></div>

      {courses.length === 0
        ? <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No courses available yet.</p>
        : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
      }
    </main>
  );
}
