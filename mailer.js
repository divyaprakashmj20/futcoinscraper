const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail(subject, text) {
  await transporter.sendMail({
    from: `"Futcoin Bot" <${process.env.SMTP_USER}>`,
    to: process.env.ALERT_EMAIL_TO,
    subject,
    text,
  });
}

module.exports = { sendMail };
