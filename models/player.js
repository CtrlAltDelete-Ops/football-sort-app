const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    shooting: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    passing: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    dribbling: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    defending: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    leadership: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
