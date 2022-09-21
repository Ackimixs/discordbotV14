const { Client, ChatInputCommandInteraction, EmbedBuilder} = require("discord.js");
const {ApplicationCommandType} = require("discord-api-types/v10");
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: "Translate to en",
    type: ApplicationCommandType.Message,
    context: true,
    category: "Context",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { channel, targetId } = interaction

        const query = await channel.messages.fetch({message: targetId})
        const raw = query.content

        if (!raw) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("❌ | There is no message to translate!")] })

        const translated = await translate(raw, { to: 'en' });

        return interaction.editReply({embeds: [
            new EmbedBuilder()
                .setColor(client.color)
                .setTitle("Translated Message")
                .addFields([
                    { name: "Original", value:"```" + raw + "```", inline: false },
                    { name: "Translated", value: "```" + translated.text + "```", inline: false }
                ])
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()
            ]})
    }
}