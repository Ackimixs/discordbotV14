const { BaseGuildTextChannel } = require('discord.js')

module.exports = {
    name: 'error',
    /**
     * @param {BaseGuildTextChannel} channel
     * @param {Error} err
     */
    async execute (channel, err) {

        console.error(err);

    }
}