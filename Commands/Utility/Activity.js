const { Client, ChatInputCommandInteraction } = require("discord.js");
const Reply = require("../../Systems/Reply");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "activity",
    description: "Creates a discord together activity",
    category: "Utility",
    options: [
        {
            name: "type",
            description: "The type of activity",
            type: 3,
            required: true,
            choices: [
                {
                    name: "YouTube",
                    value: "youtube"
                },
                {
                    name: "Chess",
                    value: "chess"
                },
                {
                    name: "Betrayal",
                    value: "betrayal"
                },
                {
                    name: "Poker",
                    value: "poker"
                },
                {
                    name: "Fishing",
                    value: "fishing"
                },
                {
                    name: "Letter Tile",
                    value: "lettertile"
                },
                {
                    name: "Word Snack",
                    value: "wordsnack"
                },
                {
                    name: "Doodle Crew",
                    value: "doodlecrew"
                },
                {
                    name: "Spell Cast",
                    value: "spellcast"
                },
                {
                    name: "Awkward",
                    value: "awkward"
                },
                {
                    name: "Putt Party",
                    value: "puttparty"
                }
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options, member } = interaction
        const choice = options.getString("type");

        const App = client.DiscordTogether

        const VC = member.voice.channel;
        if (!VC) return Reply(interaction, "❌", `You must be in a voice channel to use this command!`, true)

        await interaction.deferReply()

        App.createTogetherCode(VC.id, choice).then(async invite => {
            EditReply(interaction, "✅", `[Click here to join the activity](${invite.code})`)
        })
    }
}