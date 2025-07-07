const nodemailer = require('nodemailer');

// Create a transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Gradly - Account Verification OTP',
            html: `
                <h2>Welcome to Gradly!</h2>
                <p>Thank you for registering. Please use the OTP below to verify your account:</p>
                <h3 style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px; text-align: center;">
                    ${otp}
                </h3>
                <p>This OTP is valid for 15 minutes. If you didn't request this verification, please ignore this email.</p>
                <p>Best regards,<br>Gradly Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

module.exports = {
    sendOTPEmail
};
