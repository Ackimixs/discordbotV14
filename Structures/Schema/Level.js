const { model, Schema } = require('mongoose');

module.exports = model("level", new Schema({

    GuildId: String,
    User: String,
    XP: Number,
    Level: Number,
}))