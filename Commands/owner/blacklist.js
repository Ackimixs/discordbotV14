const { Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const DBGuild = require("../../Structures/Schema/BlacklistG");
const DBUser = require("../../Structures/Schema/BlacklistU");
const ms = require("ms");
const Embed = require("../../Systems/Embed");

module.exports = {
    name: "blacklist",
    description: "Blacklist a server or a user",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "options",
            description: "Choose between user or guild",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Member",
                    value: "member"
                },
                {
                    name: "Guild",
                    value: "guild"
                }
            ]
        },
        {
            name: "id",
            description: "The id of the user or guild",
            type: 3,
            required: true
        },
        {
            name: "reason",
            description: "The reason of the blacklist",
            type: 3,
            required: false
        }
    ],


    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guild, user, options } = interaction

        if (user.id !== "399216701788520450") return EditReply(interaction, "❌", `You can't use this command!`)

        const Options = options.getString("options");
        const ID = options.getString("id");
        const Reason = options.getString("reason") || "not provided";

        let Data;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unblacklist-yes")
                .setLabel("Yes"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unblacklist-no")
                .setLabel("No"),
        )
        let Page, col;

        switch (Options) {
            case "member":
                const Member = await client.users.fetch(ID).catch(() => {
                    return EditReply(interaction, "❌", `I can't find this user!`) })

                if (!Member) return;

                Data = await DBUser.findOne({ UserId: Member.id }).catch(err => {  })


                if (Data) {

                    Page = interaction.editReply({
                        embeds: [
                            Embed(client).setDescription(`This member is already blaklist\n\n**Do you really want to unblacklist him ?**`)
                        ],
                        components: [row]
                    })

                    col = (await Page).createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: ms('15s')
                    })

                    col.on('collect', async (button) => {

                        switch (button.customId) {
                            case "unblacklist-yes": {

                                await Data.delete()


                                await interaction.editReply({
                                    embeds: [
                                        Embed(client).setDescription(`**User unbanned on this server**`)
                                    ],
                                    components: []
                                })
                            }
                                break;

                            case "unblacklist-no": {
                                await interaction.editReply({
                                    embeds: [
                                        Embed(client).setDescription(`unblacklist request canceled`)
                                    ],
                                    components: []
                                })
                            }
                                break;
                        }
                    })

                } else {

                    Data = new DBUser({
                        UserId: Member.id,
                        Reason: Reason,
                        Time: Date.now()
                    })

                    Data.save().catch(err => {
                        return EditReply(interaction, "❌", `An error occured while saving the data!`)
                    })

                    EditReply(interaction, "✅", `Blacklisted the user ${Member.tag}!`)
                }
                break;

            case "guild":
                const Guild = await client.guilds.fetch(ID).catch(() => { return EditReply(interaction, "❌", `I can't find this guild!`) })

                if (!Guild) return;

                let guildId = Guild.id

                Data = await DBGuild.findOne({ GuildId: guildId }).catch(() => { })

                if (Data) {

                    Page = interaction.editReply({
                        embeds: [
                            Embed(client).setDescription(`This guild is already blaklist\n\n**Do you really want to unblacklist it ?**`)
                        ],
                        components: [row]
                    })

                    col = (await Page).createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: ms('15s')
                    })

                    col.on('collect', async (button) => {

                        switch (button.customId) {
                            case "unblacklist-yes": {

                                await Data.delete()

                                await interaction.editReply({
                                    embeds: [
                                        Embed(client).setDescription(`**Guild unbanned on this server**`)
                                    ],
                                    components: []
                                })
                            }
                                break;

                            case "unblacklist-no": {
                                await interaction.editReply({
                                    embeds: [
                                        Embed(client).setDescription(`unblacklist request canceled`)
                                    ],
                                    components: []
                                })
                            }
                                break;
                        }
                    })
                } else {

                    let NewData = new DBGuild({GuildId: guildId, Reason: Reason, Time: Date.now()})

                    NewData.save().catch(() => {
                        return EditReply(interaction, "❌", `An error occured while saving the data!`)
                    })

                    EditReply(interaction, "✅", `This guild is now blacklisted!`)
                }
                break;
        }

    }

}