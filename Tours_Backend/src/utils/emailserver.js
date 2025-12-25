import nodemailer from 'nodemailer';

// Create SMTP transporter for email service
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.titan.email',
    port: parseInt(process.env.SMTP_PORT) || 465, // SSL port from Titan docs
    secure: process.env.SMTP_SECURE === 'true', // true for SSL/TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
export const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from || process.env.EMAIL_USER
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection successful');
    return { success: true, message: 'Email server connection successful' };
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return { success: false, message: error.message };
  }
};

export default createTransporter;