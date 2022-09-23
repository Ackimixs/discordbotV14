const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const DB = require('../../Structures/Schema/Welcome');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        const { user, guild } = member

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        if (!data) return

        const Message = `Hey ${user.username}, welcome to **${guild.name}**!`

        let dmMsg;

        if (data.DMMessage !== null) {
            let dmMessage = data.DMMessage.content

            if (dmMessage.length !== 0) dmMsg = dmMessage
            else dmMsg = Message
        } else dmMsg = Message

        if (data.Channel !== null) {

            const Channel = guild.channels.cache.get(data.Channel)
            if (!Channel) return

            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Welcome ${user} to **${guild.name}**! Account Created : <t:${Math.floor(user.createdTimestamp / 1000)}:R>\nMember count : \`${guild.memberCount}\``)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: `Welcome by Acki` })
                .setTimestamp()

            Channel.send({ content: `${Message}`, embeds: [Embed] })
        }

        if (data.DM === true) {
            const Embed = data.DMMessage.embed

            if (data.Content === true && data.Embed === true) {
                const Sent = await member.send({ content: dmMsg }).catch(err => {
                    if (err.code !== 50007) return console.log(err)
                })

                if (!Sent) return
                if (Embed) await Sent.edit({ embeds: [Embed] })

            } else if (data.Content === true && data.Embed !== true) {
                member.send({ content: dmMsg }).catch(err => {
                    if (err.code !== 50007) return console.log(err)
                })
            } else if (data.Content !== true && data.Embed === true) {
                if (Embed) member.send({ embeds: [Embed] }).catch(err => {
                    if (err.code !== 50007) return console.log(err)
                })
            } else return
        }
    }
}