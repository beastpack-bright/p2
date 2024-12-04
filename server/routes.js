const express = require('express');
const router = express.Router();
const auth = require('./controllers/auth');
const User = require('./models/User');
const Howl = require('./models/Howl');
const Notification = require('./models/Notification');
const bcrypt = require('bcrypt');

// Middlware Route
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/404');
        return;
    }
    next();
};

// Public pages, no login
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/404', (req, res) => {
    res.render('404');
});

// Login required pages
router.get('/feed', requireAuth, (req, res) => {
    res.render('feed');
});

router.get('/howls', requireAuth, (req, res) => {
    res.render('howls');
});

router.get('/settings', requireAuth, (req, res) => {
    res.render('settings');
});

// api stuff for the howls
router.get('/api/howls', async (req, res) => {
    try {
        const howls = await Howl.find()
            .populate({
                path: 'author',
                select: 'username avatarColor avatar'
            })
            .populate({
                path: 'replies.author',
                select: 'username avatarColor avatar'
            })
            .sort({ createdAt: -1 });
            
        res.json(howls);
    } catch (err) {
        console.log('Population error:', err);
        res.status(500).json({ error: 'Failed to fetch howls' });
    }
});
router.post('/api/howls', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Must be logged in to howl' });
    }

    try {
        const newHowl = new Howl({
            content: req.body.content,
            author: req.session.user._id
        });
        await newHowl.save();
        res.json({ message: 'Howl posted successfully' });
    } catch (err) {
        console.log('Error creating howl:', err);
        res.status(500).json({ error: 'Failed to post howl' });
    }
});
router.get('/api/debug/howl/:howlId', async (req, res) => {
    try {
        const howl = await Howl.findById(req.params.howlId)
            .populate('author')
            .populate('replies.author');
            
        console.log('Reply author IDs:', howl.replies.map(r => r.author));
        
        res.json(howl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/api/howls/:howlId/replies', async (req, res) => {
    try {
        const howl = await Howl.findById(req.params.howlId);
        
        const newReply = {
            content: req.body.content,
            author: req.session.user._id,
            createdAt: new Date()
        };
        
        
        const notification = new Notification({
            userId: howl.author._id, 
            message: `${req.session.user.username} replied to your howl: "${req.body.content.substring(0, 30)}..."`,
        });
        await notification.save();
        
        howl.replies.push(newReply);
        await howl.save();
        
        const updatedHowl = await Howl.findById(howl._id)
            .populate('author')
            .populate('replies.author');
            
        res.json(updatedHowl);
    } catch (err) {
        console.log('Error details:', err);
        res.status(500).json({ error: 'Failed to post reply' });
    }
});
router.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});
router.post('/api/settings/avatar-color', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        user.avatarColor = req.body.color;
        await user.save();
        
       
        req.session.user.avatarColor = user.avatarColor;
        
        res.json({ message: 'Color updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update color' });
    }
});
//Reset
router.post('/api/settings/reset-avatar', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        user.avatar = undefined;
        user.avatarColor = '#4a4a4a';
        await user.save();
        
        req.session.user.avatar = undefined;
        req.session.user.avatarColor = '#4a4a4a';
        
        res.json({ message: 'Avatar reset successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reset avatar' });
    }
});
//Deletes
router.delete('/api/howls/:howlId/replies/:replyId', async (req, res) => {
    try {
        const howl = await Howl.findById(req.params.howlId);
        const reply = howl.replies.id(req.params.replyId);
        
        if (reply.author.toString() === req.session.user._id) {
            howl.replies.pull({ _id: req.params.replyId });
            await howl.save();
            res.json({ message: 'Reply deleted successfully' });
        } else {
            res.status(403).json({ error: 'Not authorized to delete this reply' });
        }
    } catch (err) {
        console.log('Error deleting reply:', err);
        res.status(500).json({ error: 'Failed to delete reply' });
    }
});
router.delete('/api/howls/:howlId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Must be logged in to delete howls' });
    }

    try {
        const result = await Howl.findOneAndDelete({
            _id: req.params.howlId,
            author: req.session.user._id
        });

        if (result) {
            res.json({ message: 'Howl deleted successfully' });
        } else {
            res.status(403).json({ error: 'Not authorized to delete this howl' });
        }
    } catch (err) {
        console.log('Error deleting howl:', err);
        res.status(500).json({ error: 'Failed to delete howl' });
    }
});
//Settings stuff
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/api/settings/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        user.avatar = `/uploads/${req.file.filename}`;
        await user.save();
        
        req.session.user.avatar = user.avatar;
        
        res.json({ 
            message: 'Avatar updated successfully',
            avatar: user.avatar 
        });
    } catch (err) {
        console.log('Error updating avatar:', err);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});
//Password change 
router.post('/api/settings/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.session.user._id);
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

       
        const tempUser = new User({ password: newPassword });
        user.password = tempUser.password;
        await user.save();
        
        console.log('Password updated successfully');
        
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to change password' });
    }
});

//profiles
router.get('/api/profile/:username?', async (req, res) => {
    try {
        const username = req.params.username || req.session.user.username;
        const user = await User.findOne({ username }).populate('featuredHowl');
        const howlCount = await Howl.countDocuments({ author: user._id });
        const recentHowls = await Howl.find({ author: user._id })
        
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('author', 'username avatar avatarColor');
        // New stats calculations
        const userHowls = await Howl.find({ author: user._id });
        const repliesReceived = userHowls.reduce((total, howl) => total + howl.replies.length, 0);
        
        // Get total replies made by user
        const allHowls = await Howl.find({});
        const repliesMade = allHowls.reduce((total, howl) => {
            return total + howl.replies.filter(reply => 
                reply.author.toString() === user._id.toString()
            ).length;
        }, 0);

        res.json({
            username: user.username,
            avatar: user.avatar,
            avatarColor: user.avatarColor,
            blurb: user.blurb,
            howlCount,
            packStats: {
                repliesReceived,
                repliesMade,
                totalInteractions: repliesReceived + repliesMade + howlCount
            },
            joinDate: user.createdAt,
            recentHowls,
            featuredHowl: user.featuredHowl
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
router.get('/profile/:username', requireAuth, (req, res) => {
    res.render('profile');
});
//more howls stuff
router.post('/api/howls/:id/pin', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const newFeaturedHowl = user.featuredHowl?.toString() === req.params.id ? null : req.params.id;
        
        await User.findByIdAndUpdate(req.session.user._id, {
            featuredHowl: newFeaturedHowl
        });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update pin' });
    }
});
//blurb update
router.post('/api/profile/blurb', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        user.blurb = req.body.blurb;
        await user.save();
        res.json({ message: 'Blurb updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blurb' });
    }
});
//Theme setting 
router.post('/api/settings/theme', (req, res) => {
    req.session.user.theme = req.body.theme;
    res.json({ theme: req.body.theme });
});
//Notifications
router.get('/api/notifications', requireAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            userId: req.session.user._id,
            read: false 
        })
        .sort({ createdAt: -1 })
        .limit(10);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.post('/api/notifications/read', requireAuth, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.session.user._id },
            { read: true }
        );
        res.json({ message: 'Notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});
router.post('/api/notifications/read', requireAuth, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.session.user._id },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

// auth auth auth aith auth
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// attempt at catch-all
router.get('*', (req, res) => {
    res.redirect('/404');
});
module.exports = router;