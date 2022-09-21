const { Client, EmbedBuilder } = require('discord.js')
const channelID = process.env.LOGS_CHANNEL_ID

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: "Anti-crash by acki" })
        .setTitle("Error occurred")

    process.on("unhandledRejection", (reason, p) => {
        console.log(reason, p)

        const Channel = client.channels.cache.get(channelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed.setDescription("**Unhandled Rejection/Catch :\n\n** ```js" + reason + "```")
            ]
        })
    })

    process.on("uncaughtException", (err, origin) => {
        console.log(err, origin)

        const Channel = client.channels.cache.get(channelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed.setDescription("**Uncaught Exception/Catch :\n\n** ```js" + err + "\n\n" + origin.toString() +  "```")
            ]
        })
    })

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, origin)

        const Channel = client.channels.cache.get(channelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed.setDescription("**Uncaught Exception/Catch (MONITOR):\n\n** ```js" + err + "\n\n" + origin.toString() +  "```")
            ]
        })
    })
}
