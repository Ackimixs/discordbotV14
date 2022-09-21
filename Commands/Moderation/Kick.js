const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: "kick",
    description: "kick a member from the server",
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMembers"],
    category: 'Moderation',
    options: [
        {
            name: "member",
            description: "The member you want to kick",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason why you want to kick this member",
            type: 3,
            required: false
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { options, user, guild,  } = interaction

        const member = options.getMember("member");
        const reason = options.getString("reason") || "No reason provided";

        if (member.id === user.id) return EditReply(interaction, "❌", `You can't kick yourself!`)
        if (guild.ownerId === member.id) return EditReply(interaction, "❌", `You can't kick the owner of the server!`)

        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌", `I can't kick this member because his role is higher or equal than you!`)

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kick-yes")
                .setLabel("Yes"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kick-no")
                .setLabel("No"),
        )

        const Page = interaction.editReply({
            embeds: [
                Embed.setDescription(`**Do you really want to kick this member ?**`)
            ],
            components: [row]
        })

        const col = (await Page).createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms('15s')
        })

        col.on('collect', async (button) => {
            if (button.user.id !== user.id) return

            switch (button.customId) {
                case "kick-yes": {
                    member.kick(reason);

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`**${member.user.tag}** has been kicked from the server for the reason : \`${reason}\``).setColor(client.color)
                        ],
                        components: []
                    })

                    member.send({
                        embeds: [
                            Embed.setDescription(`You have been kicked from **${guild.name}** for the reason : \`${reason}\``).setColor(client.color)
                        ]
                    }).catch(err => {
                        if (err.code !== 50007) return console.log(err);
                    })
                }
                    break;

                case "kick-no": {
                    await interaction.editReply({
                        embeds: [
                            Embed.setDescription(`Kick request canceled`).setColor(client.color)
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