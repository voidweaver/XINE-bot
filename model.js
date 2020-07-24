const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    joinedAt: {
        type: Number
    },
    settings: {
        type: Object,
        require: true
    }
});

module.exports = mongoose.model('guild', guildSchema);
