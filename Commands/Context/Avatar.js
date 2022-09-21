const { Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder} = require("discord.js");

module.exports = {
    name: "Avatar",
    type: ApplicationCommandType.User,
    context: true,
    category: "Context",

    /**
     * @param {Client} client
     * @param {ContextMenuCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { guild, targetId } = interaction

        const target = guild.members.cache.get(targetId)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: target.user.tag  + "'s avatar" , iconURL: target.user.displayAvatarURL() })
            .setImage(target.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp()

        return interaction.editReply({ embeds: [Embed] })
    }
}