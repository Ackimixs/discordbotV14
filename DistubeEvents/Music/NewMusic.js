const { Client } = require("discord.js")
const { Song, Queue } = require("distube")
const Embed = require("../../Systems/Embed")
const MusicDB = require("../../Structures/Shemas/Music")

module.exports = {
    name: 'playSong',

    /**
     * @param {Queue} queue
     * @param {Song} song
     * @param {Client} client
     * @returns {Promise<void>}
     */
    async execute (queue, song, client) {

        const Data = await MusicDB.findOne({ Guild: queue.textChannel.guild.id }).catch(err => { })

        if (!Data || !Data.Logs) return;

        const Channel = await client.channels.fetch(Data.LogsChannel)

        if (!Channel) return;

        const embed = Embed(client).setTitle("Song Playing").setDescription(`**${song.name}** - \`${song.formattedDuration}\``)

        Channel.send({ embeds: [embed] })

    }

}