const { Client, ChatInputCommandInteraction } = require("discord.js");
const Reply = require("../../Systems/Reply");
const Embed = require("../../Systems/Embed");

module.exports = {
    name: "music",
    description: "Music system",
    category: "Music",
    options: [
        {
            type: 1,
            name: 'play',
            description: 'Play music',
            options: [
                {
                    name: 'play_name',
                    description: 'music to play',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'stop',
            description: 'Stop music',
        },
        {
            type: 1,
            name: 'queue',
            description: 'Display the actual song',
        },
        {
            type: 1,
            name: 'shuffle',
            description: 'shuffle the actual queue',
        },
        {
            type: 1,
            name: 'pause',
            description: 'pause music',
        },
        {
            type: 1,
            name: 'resume',
            description: 'resume music',
        },
        {
            type: 1,
            name: 'skip',
            description: 'Skip music',
        },
        {
            type: 1,
            name: 'loop',
            description: 'loop mode for the queue',
            options: [
                {
                    name: 'repeat_mode',
                    description: 'loop mode',
                    type: 10,
                    choices: [
                        {
                            name: 'off',
                            value: 0
                        },
                        {
                            name: 'track',
                            value: 1
                        },
                        {
                            name: 'queue',
                            value: 2
                        }
                    ],
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'volume',
            description: 'Change the volume',
            options: [
                {
                    name: 'volume',
                    description: 'volume',
                    type: 10,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: 'previous',
            description: 'Change to previous song',
        },
        {
            type: 1,
            name: 'nowplaying',
            description: 'Display the actual song',
        },
        {
            type: 1,
            name: 'autoplay',
            description: 'Enable or disable autoplay',
        },
        {
            type: 1,
            name: 'jump',
            description: 'Jump to a specific song',
            options: [
                {
                    name: 'song_number',
                    description: 'song number',
                    type: 10,
                    required: true
                }
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options, guild, channel, member } = interaction;

        const subcommand = options.getSubcommand();

        if (!member.voice.channel) return interaction.reply({ content: "You must join a voice channel first", ephemeral: true});

        const queue = await client.distube.getQueue(guild);

        switch (subcommand) {
            case "play":

                const music = options.getString("play_name")

                client.distube.play(member.voice.channel, music, { member: member }).catch(err => console.log(err))

                //await Reply(interaction, "✅", `Playing **${music}**`)

                break;

            case "stop":

                if (!queue) return Reply(interaction, "❌", "There is no music playing");

                await client.distube.stop(member.voice.channel);

                await Reply(interaction, "✅", `Stopped music`)

                break;
            case "queue":

                if (!queue) return interaction.reply({ content: "No music playing", ephemeral: true});

                const embed = Embed(client).setTitle("Queue").setDescription(queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n"));

                await interaction.reply({ embeds: [embed] })

                break;
            case "shuffle":

                await queue.shuffle();

                await Reply(interaction, "✅", `Shuffled queue`);

                break;
            case "pause":

                client.distube.pause(member.voice.channel);

                await Reply(interaction, "✅", `Paused music`);

                break;
            case "resume":

                client.distube.resume(member.voice.channel);

                await Reply(interaction, "✅", `Resumed music`);

                break;
            case "skip":

                await client.distube.skip(member.voice.channel);

                await Reply(interaction, "✅", `Skipped music`);

                break;

            case "loop":

                const loopMode = options.getNumber("repeat_mode");

                await queue.setRepeatMode(loopMode);

                const mode = ["off", "track", "queue"];

                await Reply(interaction, "✅", `Loop mode set to **${mode[loopMode]}**`);

                break;

            case "volume":

                const volume = options.getNumber("volume");

                if (volume > 100 || volume < 0) return interaction.reply({ content: "Volume must be between 0 and 100", ephemeral: true});

                await queue.setVolume(volume);

                await Reply(interaction, "✅", `Volume set to **${volume}**`);

                break;
            case "previous":

                const previous = queue.previousSongs[0];

                if (!previous) return Reply(interaction, "❌", `No previous song`, true);

                const previousSong = await queue.previous();

                await Reply(interaction, "✅", `Playing **${previousSong.name}**`);

                 break;

            case "nowplaying":

                if (!queue) return interaction.reply({ content: "No music playing", ephemeral: true});

                const nowPlaying = queue.songs[0];

                const embed2 = Embed(client).setTitle("Now playing").setDescription(`**${nowPlaying.name}** - \`${nowPlaying.formattedDuration}\``);

                await interaction.reply({ embeds: [embed2] })

                break;
            case "autoplay":

                queue.toggleAutoplay();

                await Reply(interaction, "✅", `Autoplay **${queue.autoplay ? "enabled" : "disabled"}**`);

                break;


            case "jump":

                const jump = options.getNumber("song_number");

                if (jump > queue.songs.length || jump < 1) return interaction.reply({ content: "Song number must be between 1 and " + queue.songs.length, ephemeral: true});

                const song = await queue.jump(jump - 1);

                await Reply(interaction, "✅", `Jumped to song **${song.name}**`);

                break;
            default:
                await Reply(interaction, "❌", "Error", true)

        }
    }

}