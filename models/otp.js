const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    full_name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Index for email field
OTPSchema.index({ email: 1 });

module.exports = mongoose.model('OTP', OTPSchema);
