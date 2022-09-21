const { Client, MessageComponentInteraction, EmbedBuilder, InteractionType } = require('discord.js')
const DB = require('../../Structures/Shemas/Verification')
const EditReply = require('../../Systems/EditReply')

module.exports = {
    name: 'interactionCreate',

    /**
     *
     * @param {MessageComponentInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, customId, member, type } = interaction

        if (type !== InteractionType.MessageComponent) return
        const CustomId = ["verify"]

        if (!CustomId.includes(customId)) return

        await interaction.deferReply({ ephemeral: true })

        const Data = await DB.findOne({ Guild: guild.id}).catch(err => { })
        if (!Data) {
            EditReply(interaction, "❌", "Couldn't find any data!")
        }

        const Role = guild.roles.cache.get(Data.Role)

        if (member.roles.cache.has(Role.id)) {
            return EditReply(interaction, "❌", "You already have the role!")
        }

        await member.roles.add(Role.id)

        EditReply(interaction, "✅", `You have been verified!`)
    }
}

