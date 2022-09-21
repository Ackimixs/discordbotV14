const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: "unban",
    description: "unban a member from the server",
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
    category: 'Moderation',
    options: [
        {
            name: "member-id",
            description: "Provide the user id",
            type: 3,
            required: true
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { options, guild } = interaction

        const id = options.getString("member-id");
        if (isNaN(id)) return EditReply(interaction, "❌", `Please provide a valid user id! in number`)

        const bannedMembers = await guild.bans.fetch();
        if (!bannedMembers.has(id)) return EditReply(interaction, "❌", `This user is not banned!`)



        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unban-yes")
                .setLabel("Yes"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unban-no")
                .setLabel("No"),
        )

        const Page = interaction.editReply({
            embeds: [
                Embed.setDescription(`**Do you really want to unban this member ?**`)
            ],
            components: [row]
        })

        const col = (await Page).createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms('15s')
        })

        col.on('collect', async (button) => {

            switch (button.customId) {
                case "unban-yes": {

                    await guild.members.unban(id);

                    await interaction.editReply({
                        embeds: [
                            Embed.setDescription(`**User unbanned on this server**`).setColor(client.color)
                        ],
                        components: []
                    })
                }
                    break;

                case "unban-no": {
                    await interaction.editReply({
                        embeds: [
                            Embed.setDescription(`unban request canceled`).setColor(client.color)
                        ],
                        components: []
                    })
                }
                    break;
            }
        })

        col.on('end', (collected) => {
            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`❌ | You didn't provide a valid response in time`).setColor(client.color)
                ],
                components: []
            })
        })
    }
}