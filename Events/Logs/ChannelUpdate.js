const { Client, TextChannel } = require("discord.js")
const DB = require("../../Structures/Shemas/LogsChannel")
const SwitchDB = require("../../Structures/Shemas/GeneralLogs")
const Embed = require("../../Systems/Embed")

module.exports = {
    name: 'channelUpdate',
    /**
     * @param {TextChannel} oldChannel
     * @param {TextChannel} newChannel
     * @param {Client} client
     */
    async execute (oldChannel, newChannel, client) {

        const { guild } = newChannel

        const data = await DB.findOne({ Guild: guild.id }).catch(err => {})
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => {})

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const LogsChannel = data.Channel

        const Channel = await guild.channels.cache.get(LogsChannel)
        if (!Channel) return

        if (oldChannel.topic !== newChannel.topic) {

            return Channel.send({
                embeds: [
                    Embed(client).setTitle("LOGS | Channel Updates").setDescription(`the channel :${newChannel}'s topic changed from **${oldChannel.topic || 'nothing'}** to **${newChannel.topic || 'nothing'}**`)

                ]
            })

        } else if (oldChannel.name !== newChannel.name) {

            return Channel.send({
                embeds: [
                    Embed(client).setTitle("LOGS | Channel Updates").setDescription(`the channel :${newChannel}'s name changed from **${oldChannel.name}** to **${newChannel.name}**`)
                ]
            })

        }

    }
}