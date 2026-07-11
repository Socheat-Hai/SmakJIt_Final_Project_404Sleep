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

const sendOrgApproved = async (userEmail, orgName) => {
  const subject = `Organization Approved - ${orgName}`;
  const text = `Dear ${orgName},\n\nGreat news! Your organization account has been approved by our team. You can now start posting volunteer opportunities and receiving applications.\n\nLog in to SmakJit to get started.\n\nBest regards,\nSmakJit Team`;
  const html = `<div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;">
    <h2 style="color:#1D9E75;margin-bottom:8px;">Organization Approved</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Dear <strong>${orgName}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Great news! Your organization account has been <strong style="color:#1D9E75;">approved</strong> by our team. You can now start posting volunteer opportunities and receiving applications.</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Log in to SmakJit to get started.</p>
    <p style="color:#9CA3AF;font-size:13px;margin-top:32px;">Best regards,<br/>SmakJit Team</p>
  </div>`;
  await sendEmail({ to: userEmail, subject, text, html });
};

const sendOrgRejected = async (userEmail, orgName, reason) => {
  const subject = `Organization Registration Update - ${orgName}`;
  const reasonBlock = reason
    ? `<div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:12px 16px;border-radius:6px;margin:16px 0;">
        <p style="color:#991B1B;font-size:14px;margin:0;"><strong>Reason:</strong> ${reason}</p>
      </div>`
    : '';
  const text = `Dear ${orgName},\n\nWe regret to inform you that your organization registration has been reviewed and could not be approved at this time.${reason ? `\n\nReason: ${reason}` : ''}\n\nIf you believe this was a mistake or have updated your information, please contact our support team.\n\nBest regards,\nSmakJit Team`;
  const html = `<div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;">
    <h2 style="color:#DC2626;margin-bottom:8px;">Organization Registration Update</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Dear <strong>${orgName}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">We regret to inform you that your organization registration has been reviewed and could <strong style="color:#DC2626;">not be approved</strong> at this time.</p>
    ${reasonBlock}
    <p style="color:#374151;font-size:15px;line-height:1.6;">If you believe this was a mistake or have updated your information, please contact our support team.</p>
    <p style="color:#9CA3AF;font-size:13px;margin-top:32px;">Best regards,<br/>SmakJit Team</p>
  </div>`;
  await sendEmail({ to: userEmail, subject, text, html });
};

module.exports = { sendEmail, sendApplicationStatus, sendOrgApproved, sendOrgRejected };
