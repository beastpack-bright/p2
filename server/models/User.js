const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: String,
  avatarColor: {
    type: String,
    default: '#4a4a4a',
  },
  blurb: {
    type: String,
    default: '',
    maxLength: 500,
  },
  featuredHowl: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Howl',
  },
  theme: {
    type: String,
    default: 'light',
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

UserSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.statics.authenticate = async function authenticate(username, password) {
  const user = await this.findOne({ username }).exec();
  if (!user) {
    return false;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);
