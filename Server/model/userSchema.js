const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum:['User','Admin'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model('User', userSchema);