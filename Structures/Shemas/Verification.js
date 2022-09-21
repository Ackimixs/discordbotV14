const { Schema, model } = require("mongoose");

module.exports = model('Verification', new Schema({
    Guild: String,
    Role: String
}))