const { Client, ChatInputCommandInteraction } = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "role",
    description: "Give or remove a role from a member or everyone",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    category: 'Moderation',
    options: [
        {
            name: "options",
            description: "The options you want to do",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Give",
                    value: "give"
                },
                {
                    name: "Remove",
                    value: "remove"
                },
                {
                    name: "Give All",
                    value: "give-all"
                },

                {
                    name: "Remove All",
                    value: "remove-all"
                },
            ]
        },
        {
            name: "role",
            description: "The role you want to give or remove",
            type: 8,
            required: true
        },
        {
            name: "user",
            description: "The member you want to give or remove the role",
            type: 6,
            required: false
        }
    ],

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true });

        const { options, guild, member } = interaction

        const Options = options.getString("options");
        const Role = options.getRole("role");
        const Member = options.getMember("user") || member;

        if (guild.members.me.roles.highest.position <= Role.position) {
            return EditReply(interaction, "❌", `I can't give or remove this role because this role is higher or equal than me!`)
        }

        switch(Options) {
            case "give": {
                if (guild.members.me.roles.highest.position <= Member.roles.highest.position) {
                    return EditReply(interaction, "❌", `I can't give this role to this member because his role is higher or equal than the me!`)
                }

                if (Member.roles.cache.find(r => r.id === Role.id)) {
                    return EditReply(interaction, "❌", `${Member.user.username} already have this role **${Role.name}**!`)
                }

                await Member.roles.add(Role)

                EditReply(interaction, "✅", `I have given the role **${Role.name}** to ${Member.user.username}!`)
            }

                break

            case "remove": {
                if (guild.members.me.roles.highest.position <= Member.roles.highest.position) {
                    return EditReply(interaction, "❌", `I can't give this role to this member because his role is higher or equal than the me!`)
                }

                if (!Member.roles.cache.find(r => r.id === Role.id)) {
                    return EditReply(interaction, "❌", `${Member.user.username} doesn't have this role **${role.name}**!`)
                }

                await Member.roles.remove(Role)

                EditReply(interaction, "✅", `I have removed the role **${Role.name}** to ${Member.user.username}!`)
            }

                break
            case "give-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "✅", `Everyone has got the role, **${Role.name}**!`)

                await Members.forEach( m => m.roles.add(Role))
            }

                break

            case "remove-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "✅", `Everyone has lost the role, **${Role.name}**!`)

                await Members.forEach( m => m.roles.remove(Role))
            }

                break
        }

    }
}