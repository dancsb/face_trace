const nodemailer = require('nodemailer');

const urls = require('../config/urls');

// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.naracom.hu',
    port: 25,
    secure: false
});

const sendEmail = (username, email, activationLink) => {
    const mailOptions = {
        from: `"FaceTrace" <no-reply@${urls.frontend.replace(/^https?:\/\//, '')}>`, // Sender address
        to: `"${username}" <${email}>`, // Recipient address
        subject: 'Activate Your FaceTrace Account', // Subject line
        text: `Activate your account by clicking the link: ${activationLink}`, // Fallback plain text body
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0; background: #f8f9fa; border-bottom: 1px solid #ddd;">
                <h1 style="color: #6c757d; font-size: 36px; margin: 0;">FaceTrace</h1>
            </div>

            <!-- Body -->
            <div style="padding: 20px; background: #fff;">
                <p style="font-size: 18px;">Hello ${username},</p>
                <p style="font-size: 16px; color: #555;">
                    Thank you for signing up for FaceTrace! Please confirm your email address to activate your account.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${activationLink}" 
                       style="text-decoration: none; background: #007bff; color: #fff; padding: 15px 30px; border-radius: 5px; font-size: 16px;">
                       Activate Your Account
                    </a>
                </div>
                <p style="font-size: 14px; color: #777;">
                    If the button above doesn’t work, copy and paste the following link into your browser:
                </p>
                <p style="font-size: 14px; color: #555; word-break: break-word;">
                    <a href="${activationLink}" style="color: #007bff;">${activationLink}</a>
                </p>
                <p style="font-size: 14px; color: #555; margin-top: 30px;">
                    Need help? Visit our <a href="${urls.frontend}/support" style="color: #007bff;">Support Center</a> or contact us directly at <a href="mailto:support@${urls.frontend.replace(/^https?:\/\//, '')}" style="color: #007bff;">support@${urls.frontend.replace(/^https?:\/\//, '')}</a>.
                </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 10px 0; background: #f8f9fa; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #777;">
                    You’re receiving this email because you signed up for FaceTrace. If this wasn’t you, please ignore this email.
                </p>
                <p style="font-size: 12px; color: #777;">
                    FaceTrace | <a href="${urls.frontend}" style="color: #007bff;">${urls.frontend}</a>
                </p>
            </div>
        </div>
        ` // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;