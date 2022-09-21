const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        const { content, author, guild, mentions, member, channel } = message;
        const { user } = client;

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return;
        if (!content.includes(user.id)) return;

        return message.reply({

            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setDescription("Hey, I see you mentioned me! Do you need help? If so, you can use the slash commands!")
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: `Introduced by Acki` })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=919327421684133899&permissions=8&scope=bot%20applications.commands")
                        .setLabel("Invite me!"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=919327421684133899&permissions=8&scope=bot%20applications.commands")
                        .setLabel("Dashboard!"),
                )
            ]

        }).then(msg => {
            setTimeout(() => {

                msg.delete().catch(err => {
                    if (err.code === 10008) return console.log(err);
                })
            }, ms("10s"))
        })
    }
}