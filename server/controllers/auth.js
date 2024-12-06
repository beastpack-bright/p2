const bcrypt = require('bcrypt');
const User = require('../models/User');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password').lean();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      _id: user._id,
      username: user.username,
      avatarColor: user.avatarColor,
      avatar: user.avatar,
    };

    return res.status(200).json({
      success: true,
      redirect: '/feed',
    });
  } catch (err) {
    console.log('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    req.session.user = newUser;
    return res.json({ message: 'Signup successful' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  login,
  signup,
};
