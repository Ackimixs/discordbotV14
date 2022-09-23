const { Client, Message } = require("discord.js")
const Embed = require("../../Systems/Embed")
const LevelDB = require("../../Structures/Schema/Level")
const ChannelDB = require("../../Structures/Schema/LevelUpChannel")

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute (message, client) {

        const { author, guild } = message;

        if (!guild || author.bot) return

        LevelDB.findOne({ GuildID: guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {

                await LevelDB.create({
                    GuildId: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0
                })

            }
        })

        const ChannelData = await ChannelDB.findOne({ GuildID: guild.id }).catch((err) => { });

        const give = Math.floor(Math.random() * 29) + 1;

        const data = await LevelDB.findOne({ GuildID: guild.id, User: author.id }).catch((err) => { });
        if (!data) return

        const requiredXP = data.Level * data.Level * 100 + 100;

        if (data.XP + give > requiredXP) {
            data.XP += give;
            data.Level += 1;
            await data.save()


            if (ChannelData) {
                const Channel = guild.channels.cache.get(ChannelData.ChannelID);
                if (!Channel) return;

                Channel.Send({
                    content: `${author}`,
                    embeds: [
                        Embed(client).setDescription("Congratulations! You have leveled up to level " + data.Level)
                    ]
                })
            }
        } else {
            data.XP += give;
            await data.save()
        }
    }
}