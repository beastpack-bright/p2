/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
const bcrypt = require('bcrypt');
const User = require('../models/User');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = user;
    return res.json({ message: 'Logged in successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
};
