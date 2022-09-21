const { Perms } = require('../Validation/Permissions');
const { Client } = require("discord.js")
const ms = require("ms");
/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Commands Loaded");

    let CommandsArray = [];

    const CommandFile = await PG(`${process.cwd()}/Commands/*/*.js`);

    await CommandFile.map( async (file) => {

        const command = require(file);

        if(!command.name) {
            return Table.addRow(file.split("/")[7], "FAILED", "Missing a name");
        }
        if (!command.context && !command.description) {
            return Table.addRow(file.split("/")[7], "FAILED", "Missing a description");
        }
        if (command.UserPerms) {
            if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = false;
            else return Table.addRow(file.split("/")[7], "FAILED", "Invalid User Permission");
        }

        await client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "SUCCESS");

    })

    console.log(Table.toString());

    client.on('ready', async () => {

        const guilds = await client.guilds.fetch();
        guilds.forEach(guild => {
            client.guilds.fetch(guild.id).then(guild => guild.commands.set(CommandsArray));
        })

        setInterval(async () => {

            const guilds = await client.guilds.fetch();
            guilds.forEach(guild => {
                 client.guilds.fetch(guild.id).then(guild => guild.commands.set(CommandsArray));
            })

        }, ms('10s'))

    })
}