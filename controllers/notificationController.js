const Notification = require('../models/notification');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { user, message, relatedEntity, onModel } = req.body;

        if (!user || !message) {
            return res.status(400).json({ message: 'User ID and message are required' });
        }

        // Validate onModel if relatedEntity is provided
        if (relatedEntity && !onModel) {
            return res.status(400).json({ message: 'onModel is required when relatedEntity is provided' });
        }

        const notification = new Notification({
            user,
            message,
            relatedEntity,
            onModel
        });

        await notification.save();

        res.status(201).json({
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 20, page = 1 } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: Math.min(parseInt(limit, 10), 50),
            sort: { createdAt: -1 },
            populate: [
                {
                    path: 'relatedEntity',
                    select: '-__v',
                    populate: {
                        path: 'onModel',
                        select: 'name title' // Adjust based on your models
                    }
                }
            ]
        };

        const notifications = await Notification.paginate(
            { user: userId },
            options
        );

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({ message: error.message });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: error.message });
    }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({
            message: `Marked ${result.nModified} notifications as read`,
            updatedCount: result.nModified
        });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
