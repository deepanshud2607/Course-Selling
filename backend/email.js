const nodemailer = require("nodemailer");

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SENDER_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SENDER_EMAIL) {
    throw new Error("Email is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and SENDER_EMAIL to backend/.env");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

async function sendMail({ to, subject, text }) {
  return getTransporter().sendMail({ from: process.env.SENDER_EMAIL, to, subject, text });
}

async function sendVerificationCode(email, code) {
  return sendMail({ to: email, subject: "Your CourseHub verification code", text: `Your CourseHub verification code is ${code}. It expires in 10 minutes.` });
}

async function sendCourseAccess(email, course) {
  return sendMail({ to: email, subject: `Your CourseHub course: ${course.title}`, text: `Thanks for your purchase. Your course link is: ${course.contentURL}` });
}

module.exports = { sendVerificationCode, sendCourseAccess };
