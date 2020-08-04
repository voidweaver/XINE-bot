const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const search = require('yt-search');

const { c } = require('../settings.json');
const Player = require('../MusicPlayer');
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

        let player = this.client.players.get(msg.guild.id);

        if (!player && !msg.member.voice.channel) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Error')
                    .setColor(c.embed.error)
                    .setDescription('You and I am not in a voice channel.')
            );
            return;
        }

        if (player) player.join(msg.member.voice.channel);
        else this.client.players.set(msg.guild.id, new Player(msg.member.voice.channel));

        player = this.client.players.get(msg.guild.id);

        let song;

        let youtube_regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|\w+\?v=|.+&v=))((\w|-){11})/;

        let ytdl_query = args.query;

        if (youtube_regex.test(args.query)) {
            let id_regex = /(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/;
            ytdl_query = {
                videoId: args.query.match(id_regex)[1],
            };
        }

        try {
            song = await new Promise((resolve, reject) => {
                search(ytdl_query, (err, data) => {
                    if (err || !data || (data.videos && !data.videos.length)) {
                        reject(err);
                        return;
                    }

                    let video = data.videos ? data.videos[0] : data;
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
        } catch (err) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle("Couldn't find the song you're looking for")
                    .setColor(c.embed.error)
                    .setDescription(`No matches are found for query "${args.query}"`)
            );
            return;
        }

        player.queue(song);

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
