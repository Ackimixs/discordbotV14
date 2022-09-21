const { Client, ChatInputCommandInteraction } = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "simulate",
    description: "Simulates the join event",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "options",
            description: "The options you want to do",
            type: 3,
            choices: [
                {
                    name: "Join",
                    value: "join"
                },
                {
                    name: "Leave",
                    value: "leave"
                }
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { options, user, member} = interaction

        const Options = options.getString("options");

        if (user.id !== "399216701788520450") return EditReply(interaction,"❌", `You can't use this command!`)


        switch (Options) {
            case "join":
                EditReply(interaction, "✅", `Simulated the join event!`)

                client.emit("guildMemberAdd", member);

                break
            case "leave":
                EditReply(interaction, "✅", `Simulated the leave event!`)

                client.emit("guildMemberRemove", member);

                break
        }

    }
}