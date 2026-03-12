# CourseHub

A simple course-selling platform. Express + MongoDB backend, React frontend.

```
courseSelling/
├── backend/    ← REST API (Node + Express)
└── frontend/   ← React SPA (Vite)
```

---

## Quick start

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```
PORT=3000
MONGO_URI=mongodb://...
USER_JWT_SECRET=some_secret
ADMIN_JWT_SECRET=another_secret
```

```bash
npm run dev     # nodemon
# or
npm start       # plain node
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:5173
```

Vite proxies all `/user`, `/admin`, `/courses` requests to `localhost:3000`, so no CORS setup is needed during development.

---

## API overview

### Public

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/courses` | All courses |
| GET | `/courses/preview?courseID=` | Single course |

### User (`/user`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/user/signup` | — | Register |
| POST | `/user/login` | — | Login, returns token |
| PUT | `/user/resetPass` | ✓ | Change password |
| GET | `/user/purchases` | ✓ | Purchased courses |
| POST | `/user/purchase?courseID=` | ✓ | Buy a course |

### Admin (`/admin`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/admin/signup` | — | Register as admin |
| POST | `/admin/login` | — | Login, returns token |
| PUT | `/admin/resetPass` | ✓ | Change password |
| GET | `/admin/courses` | ✓ | Own courses |
| POST | `/admin/courses` | ✓ | Add course |
| PUT | `/admin/courses?courseID=` | ✓ | Edit course |
| DELETE | `/admin/courses?courseID=` | ✓ | Delete course |

Auth = pass the JWT as the `authorization` header (no `Bearer` prefix).

---

## Frontend pages

| Path | Description |
|------|-------------|
| `/` | Browse all courses |
| `/course/:id` | Course detail + purchase |
| `/user/login` | User sign in |
| `/user/signup` | User sign up |
| `/dashboard` | Purchased courses + change password |
| `/admin/login` | Admin sign in |
| `/admin/signup` | Admin sign up |
| `/admin/dashboard` | Manage courses + change password |

---

## Tech stack

**Backend** — Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt, Zod  
**Frontend** — React 18, React Router v6, Vite
