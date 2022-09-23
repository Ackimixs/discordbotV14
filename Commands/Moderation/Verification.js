const { Client, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder} = require("discord.js");
const DB = require("../../Structures/Schema/Verification")
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "verify",
    description: "Inbuild Verification System",
    UserPerms: ["ManageGuild"],
    category: 'Moderation',
    options: [
        {
            name: "role",
            description: "The role you want to give to the verified members",
            type: 8,
            required: true
        },
        {
            name: "channel",
            description: "The channel where the bot will send the verification message",
            type: 7,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { options, guild, channel } = interaction

        const role = options.getRole("role");
        const Channel = options.getChannel("channel") || channel

        let Data = await DB.findOne({ Guild: guild.id }).catch(err=> {

        })

        if (!Data) {
            Data = new DB({
                Guild: guild.id,
                Role: role.id,
            })

            await Data.save()
        }
        else {
            Data.Role = role.id

            await Data.save()
        }

        Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("✅ | Verification")
                    .setDescription(`Click the button to verify yourself`)
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("verify")
                        .setLabel("Verify")
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        })
        return EditReply(interaction, "✅", `Verification system has been setup!`)
    }
}