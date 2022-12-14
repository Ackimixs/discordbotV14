const { model, Schema } = require('mongoose');

module.exports = model("generalLogs", new Schema({

    Guild: String,
    MemberRole: Boolean,
    MemberNick: Boolean,
    ChannelTopic: Boolean,
    MemberBoost: Boolean,
    RolesStatus: Boolean,
    ChannelStatus: Boolean,
    EmojiStatus: Boolean,
    MemberBan: Boolean
}))