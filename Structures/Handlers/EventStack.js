const { Client } = require("discord.js");

/**
 * @param {Client} client
 * @param {PG} PG
 * @param {Ascii} Ascii
 */

module.exports = async(client, PG, Ascii) =>{
    const EventFiles = await PG(`${process.cwd()}/EventStack/*.js`);

    EventFiles.map(value => require(value));

}