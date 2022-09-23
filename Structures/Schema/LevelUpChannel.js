const { model, Schema } = require('mongoose');

module.exports = model("levelUpChannel", new Schema({

    GuildId: String,
    ChannelId: String,

}))