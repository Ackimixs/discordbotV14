const { Client } = require("discord.js");
const client = require("../Structures/index");
const Embed = require("../Systems/Embed");
const invites = new Map();
const LogsDB = require("../Structures/Schema/LogsChannel");
const wait = require("timers/promises").setTimeout;
const { Discord } = require('discord-id')


const djsClient = new Discord(process.env.TOKEN)

client.on("ready", async () => {
     await wait(1000);

     await client.guilds.cache.forEach(async (guild) => {

         const firstInvites = await guild.invites.fetch().catch((err) => {
             if (err.code !== 50013) return console.log(err);
         });

         try {
             invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
         } catch (e) {
            if (e) return;
         }
     })
})

client.on("inviteDelete", invite => {
    invites.get(invite.guild.id).delete(invite.code);
})

client.on("inviteCreate", invite => {
    invites.get(invite.guild.id).set(invite.code, invite.uses);
})

client.on("guildCreate", guild => {
    guild.invites.fetch().then(guildInvites => {
        invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
    }).catch((err) => {
        if (err.code !== 50013) return console.log(err);
    });
})

client.on("guildDelete", guild => {
    invites.delete(guild.id);
})

client.on("guildMemberAdd", async member => {

    const { guild, user } = member;

    await guild.invites.fetch().then(async guildInvites => {
        const oldInvites = invites.get(guild.id);
        const invite = guildInvites.find((i) => i.uses > oldInvites.get(i.code));


        const Data = await LogsDB.findOne({ GuildID: guild.id }).catch((err) => {});
        if (!Data) return;


        const Channel = await guild.channels.fetch(Data.Channel);
        if (!Channel) return;

        const embed = Embed(client).setTitle('Invite Logged').setTimestamp();

        if (!invite) return Channel.send({
            embeds: [embed.setDescription(`**${user.tag}** joined the server without an invite.`)]
        })


        await djsClient.grabProfile(invite.inviter.id).then(async (inviter) => {

            const Inviter = inviter.username + '#' + inviter.discriminator

            return Channel.send({
                embeds: [embed.setDescription(`**${user.tag}** joined the server using **${invite.code}** invite from **${Inviter}**.\nThe code has ben used a total of ${invite.uses} times.`)]
            })

        }).catch((err) => { })
    }).catch((err) => {
        if (err.code !== 50013) return console.log(err);
    })
})