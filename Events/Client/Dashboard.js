const { Client } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10")
const DarkDashboard = require("dbd-dark-dashboard");
const DBD = require("discord-dashboard");
const WelcomeDB = require('../../Structures/Shemas/Welcome')
const GeneralLogsDB = require('../../Structures/Shemas/LogsChannel')
const LogsSwitchDB = require('../../Structures/Shemas/GeneralLogs')
const MusicDB = require('../../Structures/Shemas/Music')

module.exports = {
    name: "ready",

    /**
     *
     * @param {Client} client
     */
    async execute(client) {

        const { user } = client

        let Information = []
        let Moderation = []
        let Music = []

        const info = client.commands.filter(cmd => cmd.category === "Information")
        const mod = client.commands.filter(cmd => cmd.category === "Moderation")
        const music = client.commands.filter(cmd => cmd.category === "Music")

        CommandPush(info, Information)
        CommandPush(mod, Moderation)
        CommandPushMusic(music, Music)


        await DBD.useLicense(process.env.DBD);

        DBD.Dashboard = DBD.UpdatedClass()

        const Dashboard = new DBD.Dashboard({
            port: 8000,
            client: {
                id: process.env.CLIENT_ID,
                secret: process.env.CLIENT_SECRET,
            },
            redirectUri: "http://localhost:8000/discord/callback",
            domain: "http://localhost",
            bot: client,
            supportServer: {
                slash: "/support",
                inviteUrl: "https://discord.gg/7XKst9fC"
            },
            acceptPrivacyPolicy: true,
            minimizedConsoleLogs: true,
            guildAfterAuthorization: {
                use: true,
                guildId: "919330136518696980"
            },
            invite: {
                clientId: client.user.id,
                scope: ["bot", "applications.commands", "guilds", "identify"],
                permissions: "8",
                redirectUri: "https://discord.gg/7XKst9fC"
            },
            theme: DarkDashboard({
                information: {
                    createdBy: "iMidnight",
                    websiteTitle: "iMidnight",
                    websiteName: "iMidnight",
                    websiteUrl: "https:/www.imidnight.ml/",
                    dashboardUrl: "http://localhost:3000/",
                    supporteMail: "support@imidnight.ml",
                    supportServer: "https://discord.gg/yYq4UgRRzz",
                    imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
                    iconURL: "https://www.imidnight.ml/assets/img/logo-circular.png",
                    loggedIn: "Successfully signed in.",
                    mainColor: "#2CA8FF",
                    subColor: "#ebdbdb",
                    preloader: "Loading..."
                },

                index: {
                    card: {
                        category: "iMidnight's Panel - The center of everything",
                        title: `Welcome to the iMidnight discord where you can control the core features to the bot.`,
                        image: "https://i.imgur.com/axnP93g.png",
                        footer: "Footer",
                    },

                    information: {
                        category: "Category",
                        title: "Information",
                        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                        footer: "Footer",
                    },

                    feeds: {
                        category: "Category",
                        title: "Information",
                        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                        footer: "Footer",
                    },
                },

                commands: [
                    {
                        category: `Information`,
                        subTitle: `Information commands`,
                        list: Information,
                        aliasesDisabled: false,
                    },
                    {
                        category: `Moderation`,
                        subTitle: `Moderation commands`,
                        list: Moderation,
                        aliasesDisabled: false,
                    },
                    {
                        category: `Music`,
                        subTitle: `Music command`,
                        list: Music,
                        aliasesDisabled: false,
                    },
                ],
            }),
            settings: [
                // Welcome System

                {
                    categoryId: "welcome",
                    categoryName: "Welcome System",
                    categoryDescription: "Setup the welcome channel",
                    categoryOptionsList: [
                        {
                            optionId: "welch",
                            optionName: "Welcome Channel",
                            optionDescription: "Set or reset the welcome channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({guild}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = null;

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.Channel = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldm",
                            optionName: "Welcome DM",
                            optionDescription: "Enable or disable Welcome Message (in DM)",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({guild}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.DM
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: newData,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.DM = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmopt",
                            optionName: "Welcome DM Options",
                            optionDescription: "Send Content",
                            themeOptions: {
                                minimalbutton: {
                                    first: true,
                                }
                            },
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({guild}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.Content
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: newData,
                                        Embed: false,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.Content = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "welcembed",
                            optionName: "",
                            optionDescription: "Send Embed",
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({guild}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.Embed
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.Embed = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmmsg",
                            optionName: "Welcome Message (In DM)",
                            optionDescription: "Send a message to DM of newly joined member",
                            optionType: DBD.formTypes.embedBuilder({
                                username: user.username,
                                avatarURL: user.avatarURL(),
                                defaultJson: {
                                    content: "Welcome !",
                                    embed: {
                                        description: "Welcome to the server !",
                                    }
                                }
                            }),
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.DMMessage
                                else return null
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await WelcomeDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: newData,
                                        Content: false,
                                        Embed: false,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.DMMessage = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                    ]
                },

                //Logging System
                {
                    categoryId: "logs",
                    categoryName: "Logging System",
                    categoryDescription: "Setup channel for General & Invite logger",
                    categoryOptionsList: [
                        {
                            optionId: "gench",
                            optionName: "General Channel",
                            optionDescription: "Set or reset the server's logger channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({guild}) => {
                                let data = await GeneralLogsDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await GeneralLogsDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = null;

                                if (!data) {

                                    data = new GeneralLogsDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.Channel = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "memnick",
                            optionName: "Configure Logger System",
                            optionDescription: "Member Nickname",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.MemberNick
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberNick: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.MemberNick = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "chtpc",
                            optionName: "Configure Logger System",
                            optionDescription: "Channel Topic",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.ChannelTopic
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        ChannelTopic: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.ChannelTopic = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "membst",
                            optionName: "Configure Logger System",
                            optionDescription: "Member Boost",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.MemberBoost
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBoost: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.MemberBoost = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "rlsts",
                            optionName: "Configure Logger System",
                            optionDescription: "Role Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.RolesStatus
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        RolesStatus: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.RolesStatus = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "chsts",
                            optionName: "Configure Logger System",
                            optionDescription: "Channel Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.ChannelStatus
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        ChannelStatus: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.ChannelStatus = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "eysts",
                            optionName: "Configure Logger System",
                            optionDescription: "Emoji Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.EmojiStatus
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        EmojiStatus: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.EmojiStatus = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "memban",
                            optionName: "Configure Logger System",
                            optionDescription: "Member Ban",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.MemberBan
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await LogsSwitchDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBan: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.MemberBan = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                    ]
                },

                //Music
                {
                    categoryId: "Music",
                    categoryName: "Music System",
                    categoryDescription: "Music System",
                    categoryOptionsList: [
                        {
                            optionId: "logch",
                            optionName: "Logs Channel",
                            optionDescription: "Music log channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({guild}) => {
                                let data = await MusicDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.LogsChannel
                                else return null
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await MusicDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = null;

                                if (!data) {

                                    data = new MusicDB({
                                        GuildId: guild.id,
                                        LogsChannel: newData,
                                        Logs: false
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.LogsChannel = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                        {
                            optionId: "log",
                            optionName: "Logs on",
                            optionDescription: "Set the Music logs system enable",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            getActualSet: async ({guild}) => {
                                let data = await MusicDB.findOne({guildId: guild.id}).catch(err => { })
                                if (data) return data.Logs
                                else return false
                            },
                            setNew: async ({guild, newData}) => {
                                let data = await MusicDB.findOne({guildId: guild.id}).catch(err => { })
                                if (!newData) newData = false;

                                if (!data) {

                                    data = new MusicDB({
                                        GuildId: guild.id,
                                        LogsChannel: null,
                                        Logs: newData,
                                    })

                                    await data.save().catch(err => { })
                                } else {
                                    data.Logs = newData
                                    await data.save().catch(err => { })
                                }

                                return
                            }
                        },
                    ]
                },
            ]
        })

        Dashboard.init();
    }
}
function CommandPush(filteredArray, CategoryArray) {
    filteredArray.forEach(obj => {
        let cmdObject = {
            commandName: obj.name,
            commandUsage: "/" + obj.name,
            commandDescription: obj.description,
            commandAlias: "None"
        }

        CategoryArray.push(cmdObject)
    });
}

function CommandPushMusic(filteredArray, CategoryArray) {
    filteredArray.forEach(obj => {
        obj.options.forEach(option => {
            let cmdObject = {
                commandName: option.name,
                commandUsage: "/" + "music " + option.name,
                commandDescription: option.description,
                commandAlias: "None"
            }

            CategoryArray.push(cmdObject)
        })
    });
}