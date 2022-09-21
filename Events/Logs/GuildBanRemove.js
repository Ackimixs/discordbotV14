const { Client, Guild, User } = require("discord.js")
const DB = require("../../Structures/Shemas/LogsChannel");
const SwitchDB = require("../../Structures/Shemas/GeneralLogs");
const Embed = require("../../Systems/Embed")

module.exports = {
    name: 'guildBanRemove',
    /**
     * @param {Guild} guild
     * @param {User} user
     * @param {Client} client
     */
    async execute (guild, user, client) {

        const { id, discriminator, username } = user

        const data = await DB.findOne({ Guild: guild.id }).catch(err => {})
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => {})

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const LogsChannel = data.Channel

        const Channel = await guild.channels.cache.get(LogsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                Embed(client).setTitle("LOGS | Guild ban remove").setDescription(`the user : **${username}#${discriminator}** (${id})has been unbanned`)
            ]
        })
    }
}