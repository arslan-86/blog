const mongoose = require('mongoose');
const crypto = require('crypto');
const { createToken } = require('../utils/authentication.js');

const Schema = mongoose.Schema;



const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    profileImageUrl: {
        type: String,
        default: '/images/userdefault.jpg'
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    }
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified('password')) return;

    let salt = crypto.randomBytes(16).toString();
    let hashedPassword = crypto.createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPasswords', async function(email, password) {
    const user = await this.findOne({email});

    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userHash = crypto.createHmac('sha256', salt).update(password).digest('hex');

    if( hashedPassword !== userHash) {
        throw new Error('Invalid Email or Password');
    }
    
    const token = createToken(user);
    return token;
})

const User = mongoose.model('User', userSchema);

module.exports = User;