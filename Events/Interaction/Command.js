const { Client, CommandInteraction, InteractionType } = require('discord.js')
const { ApplicationCommand } = InteractionType
const Reply = require('../../Systems/Reply')
const BlacklistGuildDB = require('../../Structures/Shemas/BlacklistG')
const BlacklistUserDB = require('../../Structures/Shemas/BlacklistU')
const Embed = require('../../Systems/Embed')

module.exports = {
    name: "interactionCreate",

    /**
     * @param { CommandInteraction } interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {user, guild, commandName, member, type} = interaction


        if (!guild || user.bot) return
        if (type !== ApplicationCommand) return

        const BlacklistGuildData = await BlacklistGuildDB.findOne({ GuildId: guild.id }).catch(err => {})
        const BlacklistUserData = await BlacklistUserDB.findOne({ UserId: user.id }).catch(err => {})


        if (BlacklistGuildData) {
            return interaction.reply({
                embeds: [
                    Embed(client).setTitle("Server Blacklisted").setDescription(`This guild is blacklisted from using this bot on <t:${parseInt((BlacklistGuildData.Time / 1000))}:R>, for the reason : **${BlacklistGuildData.Reason}**`)
                ]
            })
        }

        if (BlacklistUserData) {
            return interaction.reply({
                embeds: [
                    Embed(client).setTitle("User Blacklisted").setDescription(`You have been blacklisted from using this bot on <t:${parseInt((BlacklistUserData.Time / 1000))}:R>, for the reason : **${BlacklistUserData.Reason}**`)
                ], ephemeral: true
            })
        }

        const command = client.commands.get(commandName);

        if (!command) {
            await Reply(interaction, "❌", `An error occurred while running the command!`, true)
            return client.commands.delete(command)
        }

        if (command.UserPerms && command.UserPerms.length !== 0) {
            if (!member.permissions.has(command.UserPerms)) return Reply(interaction, "❌", `You need \`${command.UserPerms.join(", ")}\` permission to execute this command!`, true)
        }
        if (command.BotPerms && command.BotPerms.length !== 0) {
            if (!member.permissions.has(command.BotPerms)) return Reply(interaction, "❌", `I need \`${command.BotPerms.join(", ")}\` permission to execute this command!`, true)
        }

        await command.execute(interaction, client);
    }
}