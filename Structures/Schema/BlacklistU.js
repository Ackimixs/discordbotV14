const { model, Schema } = require('mongoose');

module.exports = model("blacklist-user", new Schema({

    UserId: String,
    Reason: String,
    Time: Number
}))