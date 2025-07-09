const mongoose = require('mongoose');

const scholarshipApplicationSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    scholarship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can't apply for the same scholarship twice
scholarshipApplicationSchema.index({ profile: 1, scholarship: 1 }, { unique: true });

module.exports = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);
