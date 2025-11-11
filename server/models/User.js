const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },         // hashed password
    refreshTokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }  // store active refrsh tokens
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);
