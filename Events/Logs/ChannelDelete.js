const { Client, GuildChannel } = require("discord.js")
const DB = require("../../Structures/Schema/LogsChannel")
const SwitchDB = require("../../Structures/Schema/GeneralLogs")
const Embed = require("../../Systems/Embed")

module.exports = {
    name: 'channelDelete',
    /**
     * @param {GuildChannel} channel
     * @param {Client} client
     */
    async execute (channel, client) {

        const { guild } = channel

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
                Embed(client).setTitle("LOGS | Channel Delete").setDescription(`the channel : **${channel.name}** has been deleted`)
            ]
        })

    }
}