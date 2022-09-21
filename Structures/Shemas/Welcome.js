const { model, Schema } = require('mongoose');

module.exports = model("Welcome", new Schema({
    Guild: String,
    Channel: String,
    DM: Boolean,
    DMMessage: Object,
    Content: Boolean,
    Embed: Boolean

}))