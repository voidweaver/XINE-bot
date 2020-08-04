const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const search = require('yt-search');
const ytdl = require('ytdl-core-discord');

const { c } = require('../settings.json');
const MusicQueue = require('../MusicQueue');
const { getPrefix, humanTime } = require('../util');
module.exports = class PlayCommand extends Command {
    constructor() {
        super('play', {
            aliases: ['play', 'p'],
            category: 'music',
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'text',
                },
            ],
            channel: 'guild',
        });
    }

    async exec(msg, args) {
        if (!args || !args.query) {
            msg.channel.send(
                new MessageEmbed().setTitle('No arguments provided').setColor(c.embed.error)
                    .setDescription(stripIndents`You must specify a query or the url to the song you wish to play.
                    For example: ${getPrefix(
                        this.client,
                        msg.guild
                    )}play https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
            );
            return;
        }

        if (!msg.guild.voice || !msg.guild.voice.connection) {
            if (!msg.member.voice.channel) {
                msg.channel.send(
                    new MessageEmbed()
                        .setTitle('Error')
                        .setColor(c.embed.error)
                        .setDescription('You and I am not in a voice channel.')
                );
                return;
            }

            const connection = await msg.member.voice.channel.join();

            const queue = this.client.queues.get(msg.guild.id);
            if (queue) queue.connection = connection;
            else this.client.queues.set(msg.guild.id, new MusicQueue(connection));
        }

        let queue = this.client.queues.get(msg.guild.id);

        if (!queue) {
            throw new Error('Queue not found despite creation');
        }

        let song;

        let youtube_regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|\w+\?v=|.+&v=))((\w|-){11})/;

        if (youtube_regex.test(args.query)) {
            song = {
                url: args.query,
                channel: msg.channel,
                info: await ytdl.getBasicInfo(args.query).then((data) => {
                    let info = data.player_response.videoDetails;
                    return {
                        title: info.title,
                        duration: info.lengthSeconds,
                    };
                }),
            };
        } else {
            song = await new Promise((resolve, reject) => {
                search(args.query, (err, data) => {
                    if (err) reject(err);
                    let video = data.videos[0];
                    resolve({
                        url: video.url,
                        channel: msg.channel,
                        info: {
                            title: video.title,
                            duration: video.duration.seconds,
                        },
                    });
                });
            });
        }

            queue.queue(song);

            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Song queued')
                    .setColor(c.embed.info)
                    .setDescription(
                        `**[${song.info.title}](${song.url})** (${humanTime(song.info.duration)})`
                    )
            );
        }
};
