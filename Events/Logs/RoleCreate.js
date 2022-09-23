const { Client, Role } = require("discord.js")
const DB = require("../../Structures/Schema/LogsChannel");
const SwitchDB = require("../../Structures/Schema/GeneralLogs");
const Embed = require("../../Systems/Embed");

module.exports = {
    name: 'roleCreate',
    /**
     * @param {Role} role
     * @param {Client} client
     */
    async execute (role, client) {

        const { guild, name } = role

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
                Embed(client).setTitle("LOGS | Role created").setDescription(`the role : **${name}** has been created`)
            ]
        })

    }
}