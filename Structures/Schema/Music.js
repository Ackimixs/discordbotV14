const { model, Schema } = require('mongoose');

module.exports = model("Music", new Schema({
    GuildId: String,
    LogsChannel: String,
    Logs: Boolean
}))