const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    full_name: String,
    email: { type: String, required: true, index: true },
    password: String,
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    purpose: {
        type: String,
        enum: ['registration', 'password_reset'],
        default: 'registration'
    },
    createdAt: { type: Date, default: Date.now }
});


OTPSchema.index({ email: 1, purpose: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 


OTPSchema.statics.generatePasswordResetOTP = async function (email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    
    await this.deleteMany({ email, purpose: 'password_reset' });

    return this.create({
        email,
        otp,
        expiresAt,
        purpose: 'password_reset'
    });
};


OTPSchema.statics.verifyPasswordResetOTP = async function (email, otp) {
    const otpRecord = await this.findOneAndDelete({
        email,
        otp,
        purpose: 'password_reset',
        expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
        throw new Error('Invalid or expired OTP');
    }

    return true;
};

module.exports = mongoose.model('OTP', OTPSchema);
