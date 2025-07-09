const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    intake: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'accepted', 'rejected', 'cancelled'],
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

ApplicationSchema.index({ profile: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
