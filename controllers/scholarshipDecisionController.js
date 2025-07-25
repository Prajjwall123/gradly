const ScholarshipApplication = require('../models/scholarshipApplication');
const Notification = require('../models/notification');
const fs = require('fs').promises;
const path = require('path');


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

const acceptScholarshipApplication = async (req, res) => {
    try {
        const { scholarshipAppId } = req.params;
        const { message } = req.body;
        const file = req.file; 

        console.log('Accepting scholarship application:', {
            scholarshipAppId,
            hasFile: !!file,
            message
        });

        
        const scholarshipApp = await ScholarshipApplication.findById(scholarshipAppId)
            .populate('user', 'full_name email')
            .populate('scholarship', 'scholarship_name')
            .populate('application');

        if (!scholarshipApp) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship application not found'
            });
        }

        
        if (scholarshipApp.application?.status === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Cannot accept scholarship for a rejected application'
            });
        }

        let letterPath = null;

        
        if (file) {
            const uploadDir = path.join(__dirname, '../uploads/scholarship-letters');

            
            await fs.mkdir(uploadDir, { recursive: true });

            
            const filename = `acceptance_${scholarshipApp._id}_${Date.now()}.pdf`;
            letterPath = path.join('uploads/scholarship-letters', filename);
            const fullPath = path.join(__dirname, '../', letterPath);

            console.log('Saving file to:', fullPath);

            
            await fs.writeFile(fullPath, file.buffer);
        }

        
        const updateData = {
            status: 'accepted',
            acceptedAt: new Date(),
            message: message || scholarshipApp.message
        };

        if (letterPath) {
            updateData.acceptanceLetter = letterPath;
        }

        const updatedApp = await ScholarshipApplication.findByIdAndUpdate(
            scholarshipAppId,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate('user', 'full_name email')
            .populate('scholarship', 'scholarship_name')
            .populate('application');

        
        await Notification.create({
            user: scholarshipApp.user._id,
            message: `Your scholarship application for ${scholarshipApp.scholarship?.scholarship_name || 'scholarship'} has been accepted.`,
            relatedEntity: scholarshipApp._id,
            onModel: 'Scholarship',
            isRead: false
        });

        res.json({
            success: true,
            message: 'Scholarship application accepted successfully',
            scholarshipApplication: updatedApp
        });

    } catch (error) {
        console.error('Error accepting scholarship application:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting scholarship application',
            error: error.message
        });
    }
};


const rejectScholarshipApplication = async (req, res) => {
    try {
        const { scholarshipAppId } = req.params;
        const { message } = req.body;

        
        const scholarshipApp = await ScholarshipApplication.findById(scholarshipAppId)
            .populate('user')
            .populate('scholarship')
            .populate('application');

        if (!scholarshipApp) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship application not found'
            });
        }

        let letterPath = null;

        
        if (req.file) {
            const file = req.file;
            const uploadDir = path.join(__dirname, '../uploads/scholarship-letters');

            
            await fs.mkdir(uploadDir, { recursive: true });

            
            const filename = `rejection_${scholarshipApp._id}_${Date.now()}.pdf`;
            letterPath = path.join('uploads/scholarship-letters', filename);
            const fullPath = path.join(__dirname, '../', letterPath);

            
            await fs.writeFile(fullPath, file.buffer);
        }

        
        scholarshipApp.status = 'rejected';
        if (letterPath) {
            scholarshipApp.rejectionLetter = letterPath;
        }
        if (message) {
            scholarshipApp.message = message;
        }
        scholarshipApp.rejectedAt = new Date();
        await scholarshipApp.save();

        
        await Notification.create({
            user: scholarshipApp.user._id,
            message: `Your scholarship application for ${scholarshipApp.scholarship?.scholarship_name || 'scholarship'} has been rejected.`,
            relatedEntity: scholarshipApp._id,
            onModel: 'Scholarship',
            isRead: false
        });

        
        const updatedApp = await ScholarshipApplication.findById(scholarshipApp._id)
            .populate('user', 'full_name email')
            .populate('scholarship', 'scholarship_name')
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
            message: 'Error rejecting scholarship application',
            error: error.message
        });
    }
};

module.exports = {
    acceptScholarshipApplication,
    rejectScholarshipApplication
};
