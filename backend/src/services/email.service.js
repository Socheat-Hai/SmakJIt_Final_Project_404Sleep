const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured. Skipping email to:', to);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SmakJit" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

const sendApplicationStatus = async (userEmail, userName, opportunityTitle, status) => {
  const subject = status === 'accepted'
    ? `Application Accepted - ${opportunityTitle}`
    : `Application Update - ${opportunityTitle}`;
  const text = status === 'accepted'
    ? `Dear ${userName},\n\nCongratulations! Your application for "${opportunityTitle}" has been accepted by the organization. They will reach out to you with further details.\n\nBest regards,\nSmakJit Team`
    : `Dear ${userName},\n\nThank you for your interest in "${opportunityTitle}". Unfortunately, the organization has decided to move forward with other candidates at this time.\n\nDon't be discouraged — browse more opportunities on SmakJit to find the right fit.\n\nBest regards,\nSmakJit Team`;
  await sendEmail({ to: userEmail, subject, text });
};

module.exports = { sendEmail, sendApplicationStatus };
