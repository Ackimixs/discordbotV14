const { EmbedBuilder } = require('discord.js')

function Embed(client) {

        return new EmbedBuilder()
            .setColor(client.color)
            .setTimestamp()
            .setFooter({ text: `Create by Acki`, avatar: client.user.avatarURL({ dynamic: true }) })
}

module.exports = Embed