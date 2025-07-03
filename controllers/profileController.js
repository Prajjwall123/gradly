const Profile = require('../models/profile');

const createProfile = async (userId) => {
    try {
        const profile = new Profile({ user: userId });
        await profile.save();
        return profile;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
};

const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOne({ user: userId }).populate('user', 'email full_name');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { error: error.toString() })
        });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile
};