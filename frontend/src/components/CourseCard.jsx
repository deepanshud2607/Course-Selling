import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const { _id, title, price, imageURL } = course;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {imageURL
        ? <img className="h-48 w-full object-cover" src={imageURL} alt={title} onError={e => e.target.style.display = 'none'} />
        : <div className="grid h-48 w-full place-items-center bg-indigo-50 text-sm font-medium text-indigo-400">Course image</div>
      }

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 font-semibold text-slate-900">{title}</p>
        <p className="mt-3 text-lg font-bold text-slate-900">${price}</p>
      </div>

      <div className="border-t border-slate-100 p-4">
        <Link to={`/course/${_id}`}>
          <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">View course</button>
        </Link>
      </div>
    </article>
  );
}
