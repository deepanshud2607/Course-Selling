import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const { _id, title, price, imageURL } = course;

  return (
    <div className="course-card">
      {imageURL
        ? <img src={imageURL} alt={title} onError={e => e.target.style.display = 'none'} />
        : <div className="course-card-img-placeholder">No image</div>
      }

      <div className="course-card-body">
        <p className="course-card-title">{title}</p>
        <p className="course-card-price">${price}</p>
      </div>

      <div className="course-card-footer">
        <Link to={`/course/${_id}`}>
          <button className="btn btn-outline btn-full btn-sm">View course</button>
        </Link>
      </div>
    </div>
  );
}
