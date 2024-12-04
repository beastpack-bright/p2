const User = require('../models/User');
const bcrypt = require('bcrypt');
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = {
            _id: user._id,
            username: user.username
        };
        
        return res.json({ message: 'Login successful' });
    } catch (err) {
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
  signup
};