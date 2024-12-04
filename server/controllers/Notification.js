const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ userId: req.session.account._id })
        .sort({ createdAt: -1 })
        .limit(10);
    return res.json(notifications);
};

const markAsRead = async (req, res) => {
    await Notification.updateMany(
        { userId: req.session.account._id },
        { read: true }
    );
    return res.status(200).json({ message: 'Notifications marked as read' });
};

module.exports = {
    getNotifications,
    markAsRead,
};