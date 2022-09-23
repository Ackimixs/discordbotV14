const {Collection} = require("discord.js");
const { GatewayIntentBits } = require("discord-api-types/v10");
const { Client, Partials } = require("discord.js");
const ms = require("ms");
require("dotenv").config();
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;
const { promisify } = require("util");
const { glob } = require("glob");
const ASCII = require("ascii-table");

const { DisTube } = require("distube")
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const { DiscordTogether } = require("discord-together");

const PG = promisify(glob)

const client = new Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent],
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "users", "roles"] },
    rest: { timeout: ms('1m') },
})
client.color = 'Random';
client.events = new Collection();

client.commands = new Collection();
//Music part


client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
})
client.DiscordTogether = new DiscordTogether(client);

(async() => {

    const Handlers = ['Commands', 'Events', "DistubeEvents", "EventStack", "Errors"]
    Handlers.forEach( handler => {

        require(`./Handlers/${handler}`)(client, PG, ASCII)

    })

    module.exports = client;

    await client.login(process.env.BOT_TOKEN);
})()
