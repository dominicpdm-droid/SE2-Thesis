const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    activity_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity_timestamp: {
        type: Date,
        default: Date.now
    },
    activity_message: {
        type: String,
        required: true
    },
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;