import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  // Development mode
  //
  // If EMAIL_USER and EMAIL_PASS are empty,
  // we don't attempt to send a real email.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("====================================");
    console.log("📧 EMAIL NOT CONFIGURED");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("====================================");
    console.log(html);
    console.log("====================================");

    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Football Hub BD" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;