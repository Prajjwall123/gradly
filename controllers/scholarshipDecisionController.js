const ScholarshipApplication = require('../models/scholarshipApplication');
const Notification = require('../models/notification');
const fs = require('fs');
const path = require('path');

// Helper function to save file and return its path
const saveFile = (file, scholarshipAppId, type) => {
    if (!file) return null;

    const uploadDir = path.join(__dirname, '../uploads/scholarship-letters');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${type}_${scholarshipAppId}_${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/scholarship-letters/${filename}`;
};

// Accept a scholarship application
const acceptScholarshipApplication = async (req, res) => {
    try {
        const { scholarshipAppId } = req.params;
        const { message } = req.body;
        const acceptanceLetter = req.file;

        const scholarshipApp = await ScholarshipApplication.findById(scholarshipAppId)
            .populate('user', 'full_name email')
            .populate('scholarship', 'name')
            .populate('application', 'status');

        if (!scholarshipApp) {
            return res.status(404).json({ message: 'Scholarship application not found' });
        }

        // Check if the related application is rejected
        if (scholarshipApp.application.status === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Cannot accept scholarship for a rejected application'
            });
        }

        // Save acceptance letter if provided
        let letterPath = null;
        if (acceptanceLetter) {
            letterPath = saveFile(acceptanceLetter, scholarshipAppId, 'scholarship_acceptance');
        }

        // Update scholarship application status
        scholarshipApp.status = 'accepted';
        scholarshipApp.acceptanceLetter = letterPath;
        scholarshipApp.acceptedAt = new Date();
        scholarshipApp.message = message;
        await scholarshipApp.save();

        // Create notification
        await Notification.create({
            user: scholarshipApp.user._id,
            message: message || `Congratulations! Your scholarship application for ${scholarshipApp.scholarship.name} has been accepted.`,
            relatedEntity: scholarshipApp._id,
            onModel: 'ScholarshipApplication'
        });

        const updatedApp = await ScholarshipApplication.findById(scholarshipAppId)
            .populate('user')
            .populate('scholarship')
            .populate('application');

        res.json({
            success: true,
            message: 'Scholarship application accepted successfully',
            scholarshipApplication: updatedApp
        });

    } catch (error) {
        console.error('Error accepting scholarship application:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reject a scholarship application
const rejectScholarshipApplication = async (req, res) => {
    try {
        const { scholarshipAppId } = req.params;
        const { message } = req.body;
        const rejectionLetter = req.file;

        const scholarshipApp = await ScholarshipApplication.findById(scholarshipAppId)
            .populate('user', 'full_name email')
            .populate('scholarship', 'name')
            .populate('application');

        if (!scholarshipApp) {
            return res.status(404).json({ message: 'Scholarship application not found' });
        }

        // Save rejection letter if provided
        let letterPath = null;
        if (rejectionLetter) {
            letterPath = saveFile(rejectionLetter, scholarshipAppId, 'scholarship_rejection');
        }

        // Update scholarship application status
        scholarshipApp.status = 'rejected';
        scholarshipApp.rejectionLetter = letterPath;
        scholarshipApp.rejectedAt = new Date();
        scholarshipApp.message = message;
        await scholarshipApp.save();

        // Create notification
        await Notification.create({
            user: scholarshipApp.user._id,
            message: message || `We regret to inform you that your scholarship application for ${scholarshipApp.scholarship.name} has been rejected.`,
            relatedEntity: scholarshipApp._id,
            onModel: 'ScholarshipApplication'
        });

        const updatedApp = await ScholarshipApplication.findById(scholarshipAppId)
            .populate('user')
            .populate('scholarship')
            .populate('application');

        res.json({
            success: true,
            message: 'Scholarship application rejected successfully',
            scholarshipApplication: updatedApp
        });

    } catch (error) {
        console.error('Error rejecting scholarship application:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    acceptScholarshipApplication,
    rejectScholarshipApplication
};
