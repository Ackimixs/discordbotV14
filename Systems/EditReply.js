const { EmbedBuilder } = require('discord.js')

function EditReply(interaction, emoji, description) {

    interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${emoji} | ${description}`)
        ]
    })
}

module.exports = EditReply