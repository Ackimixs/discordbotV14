const { Client, ChatInputCommandInteraction } = require("discord.js");
const Reply = require("../../Systems/Reply");
const LevelDB = require("../../Structures/Shemas/Level");
const Embed = require("../../Systems/Embed");

module.exports = {
    name: "leaderboard",
    description: "Shows the server leaderboard",
    category: "Community",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { guild } = interaction;

        let text = ""

        const Data = await LevelDB.find({ GuildID: guild.id }).sort({ XP: -1, Level: -1 }).limit(10).catch((err) => { });

        if (!Data) return Reply(interaction, "❌", "No data found");

        await interaction.deferReply();

        for (let counter = 0; counter < Data.length; ++counter) {
            const { User, XP, Level } = Data[counter];

            const Member = guild.members.cache.get(User)

            let MemberTag

            if (Member) {
                MemberTag = Member.user.tag
            } else {
                MemberTag = "Unknown"
            }

            let shortXp = shorten(XP)

            text += `${counter + 1}. ${MemberTag} | Level: ${Level} | XP: ${shortXp}`

        }

        await interaction.editReply({
            embeds: [
                Embed(client).setDescription(`\`\`\`${text}\`\`\``)
            ]
        })

    }
}

function shorten(count) {
    const SI_SYMBOL = ["", "k", "M", "G"];

    const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));

    let result = parseFloat((count / Math.pow(1000, i)).toFixed(2));
    result += SI_SYMBOL[i];

    return result;
}