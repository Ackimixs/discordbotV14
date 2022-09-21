const { Client, ChatInputCommandInteraction, AttachmentBuilder} = require("discord.js");
const Reply = require("../../Systems/Reply");
const LevelDB = require("../../Structures/Shemas/Level");
const Canvacord = require('canvacord');
const Embed = require("../../Systems/Embed");

module.exports = {
    name: "rank",
    description: "Display rank card",
    category: "Community",
    options: [
        {
            name: "user",
            description: "The user to display",
            type: 6,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options, user, guild } = interaction;

        const Member = options.getUser("user") || user;

        const member = await guild.members.fetch(Member.id);

        const Data = await LevelDB.findOne({ GuildID: guild.id, User: member.id }).catch((err) => { });
        if (!Data) return Reply(interaction,"❌", "This user has no data");

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 100 + 100;


        const rank = new Canvacord.Rank()
            .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(Data.XP)
            .setRequiredXP(Required)
            .setRank(1, "Rank", false)
            .setLevel(Data.Level, "Level")
            .setStatus(member.presence.status)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator);

        const card = await rank.build().catch((err) => { console.log(err) });

        const attachment = new AttachmentBuilder(card, { name: "rank.png" });

        const embed = Embed(client).setImage("attachment://rank.png").setTitle(`${member.user.username}'s Rank Card`);

        await interaction.editReply({ embeds: [embed], files: [attachment] });
    }

}