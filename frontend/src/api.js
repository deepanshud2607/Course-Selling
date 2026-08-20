// all fetch wrappers live here so pages don't repeat headers/error handling

async function handle(res) { // try to parse json, fall back to plain text
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  try { return JSON.parse(text); } catch { return text; }
}

function headers(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h.authorization = token;
  return h;
}

// ── Courses (public) ──────────────────────────────────
export const getAllCourses     = ()   => fetch('/courses').then(handle);
export const getCoursePreview  = (id) => fetch(`/courses/preview?courseID=${id}`).then(handle);

// ── User ─────────────────────────────────────────────
export const userSignup   = (body)         => fetch('/user/signup',  { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle);
export const userLogin    = (body)         => fetch('/user/login',   { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle);
export const googleLogin  = (credential)   => fetch('/user/google',  { method: 'POST', headers: headers(), body: JSON.stringify({ credential }) }).then(handle);
export const verifyEmailOtp = (email, otp) => fetch('/user/verify-email', { method: 'POST', headers: headers(), body: JSON.stringify({ email, otp }) }).then(handle);
export const resendEmailOtp = (email)      => fetch('/user/resend-otp', { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(handle);
export const userResetPass = (body, token) => fetch('/user/resetPass', { method: 'PUT', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const getPurchases = (token)        => fetch('/user/purchases', { headers: headers(token) }).then(handle);
export const purchaseCourse = (id, token)  => fetch(`/user/purchase?courseID=${id}`, { method: 'POST', headers: headers(token) }).then(handle);

// ── Admin ─────────────────────────────────────────────
export const adminSignup     = (body)         => fetch('/admin/signup',  { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle);
export const adminLogin      = (body)         => fetch('/admin/login',   { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle);
export const adminResetPass  = (body, token)  => fetch('/admin/resetPass', { method: 'PUT', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const getAdminCourses = (token)        => fetch('/admin/courses', { headers: headers(token) }).then(handle);
export const createCourse    = (body, token)  => fetch('/admin/courses', { method: 'POST', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const updateCourse    = (id, body, token) => fetch(`/admin/courses?courseID=${id}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const deleteCourse    = (id, token)    => fetch(`/admin/courses?courseID=${id}`, { method: 'DELETE', headers: headers(token) }).then(handle);
