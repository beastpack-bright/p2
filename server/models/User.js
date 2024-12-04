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
        default: '#4a4a4a'
    },
    blurb: {
        type: String,
        default: '',
        maxLength: 500
    },
    featuredHowl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Howl'
    },
    theme: {
        type: String,
        default: 'light'
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);