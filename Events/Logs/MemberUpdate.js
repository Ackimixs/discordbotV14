const { Client, GuildMember } = require("discord.js")
const DB = require("../../Structures/Shemas/LogsChannel");
const SwitchDB = require("../../Structures/Shemas/GeneralLogs");
const Embed = require("../../Systems/Embed")

module.exports = {
    name: 'guildMemberUpdate',
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     */
    async execute (oldMember, newMember, client) {

        const { guild, user } = newMember

        const data = await DB.findOne({ Guild: guild.id }).catch(err => {})
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => {})

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const LogsChannel = data.Channel

        const Channel = await guild.channels.cache.get(LogsChannel)
        if (!Channel) return

        const oldRoles = oldMember.roles.cache.map(role => role.id)
        const newRoles = newMember.roles.cache.map(role => role.id)

        if (oldRoles.length > newRoles.length) {
            const role = oldRoles.find(role => !newRoles.includes(role))
            return Channel.send({
                embeds: [
                    Embed(client).setTitle("LOGS | Role Member").setDescription(`the user : **${user.username}#${user.discriminator}** has been removed the role : <@&${role}>`)
                ]
            })
        } else if (oldRoles.length < newRoles.length) {
            const role = newRoles.find(role => !oldRoles.includes(role))
            return Channel.send({
                embeds: [
                    Embed(client).setTitle("LOGS | Role Member").setDescription(`the user : **${user.username}#${user.discriminator}** has been added the role : <@&${role}>`)
                ]
            })
        } else if (!oldMember.premiumSince && newMember.premiumSince) {
            return Channel.send({
                embeds: [
                    Embed(client).setTitle('LOGS | Boost Detected').setDescription(`the user : **${user.username}#${user.discriminator}** has been boosted the server`)
                ]
            })
        } else if (oldMember.premiumSince && !newMember.premiumSince) {
            return Channel.send({
                embeds: [
                    Embed(client).setTitle('LOGS | Boost Detected').setDescription(`the user : **${user.username}#${user.discriminator}** has been unboosted the server`)
                ]
            })
        } else if (oldMember.nickname !== newMember.nickname) {
            return Channel.send({
                embeds: [
                    Embed(client).setTitle('LOGS | Nickname Changed').setDescription(`the user : **${user.username}#${user.discriminator}** has been changed the nickname from **${oldMember.nickname || oldMember.user.username}** to **${newMember.nickname || newMember.user.username}**`)
                ]
            })
        }
    }
}