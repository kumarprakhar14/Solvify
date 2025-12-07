import nodemailer from "nodemailer";

export const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      requireTLS: process.env.SMTP_PORT === '587', // Force TLS for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 30000,      // 30 seconds
      pool: true,                // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
    });

    const info = await transporter.sendMail({
      from: 'Solvify <solvify@unique-deals.in>',
      to,
      subject,
      html: message,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail error", error.message);
    throw error;
  }
};
