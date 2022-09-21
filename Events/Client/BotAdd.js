const { Client, Guild, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "guildCreate",
    /**
     * @param {Guild} guild
     * @param {Client} client
     */

    async execute(guild, client) {
        const {name, member, channels} = guild

        let channelToSend;

        channels.cache.forEach(channel => {
            if (channel.type === ChannelType.GuildText && !channelToSend && channel.permissionsFor(client.user.id).has("SendMessages")) {
                channelToSend = channel
            }
        })

        if (!channelToSend) return;

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({name: name, iconURL: guild.iconURL()})
            .setDescription("Hey, this is **Acki**! Thanks for invite me to you server!")
            .setFooter({text: "dev by Acki"})
            .setTimestamp()

        const Row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.com/api/oauth2/authorize?client_id=919327421684133899&permissions=8&scope=bot%20applications.commands")
                .setLabel("Invite me!"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.com/api/oauth2/authorize?client_id=919327421684133899&permissions=8&scope=bot%20applications.commands")
                .setLabel("Dashboard!"),
        )

        channelToSend.send({embeds: [Embed], components: [Row]})
    }
}