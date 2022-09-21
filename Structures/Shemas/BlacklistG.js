const { model, Schema } = require('mongoose');

module.exports = model("blacklist-guild", new Schema({

    GuildId: String,
    Reason: String,
    Time: Number
}))