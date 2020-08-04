const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const JoinCommand = require('./join');

const { c } = require('../settings.json');
const MusicQueue = require('../MusicQueue');
const Song = require('../Song');
const { getPrefix } = require('../util');

module.exports = class PlayCommand extends Command {
    constructor() {
        super('play', {
            aliases: ['play', 'p'],
            category: 'music',
            args: [
                {
                    id: 'url',
                    type: 'url',
                },
            ],
            channel: 'guild',
        });
    }

    async exec(msg, args) {
        if (!args || !args.url) {
            msg.channel.send(
                new MessageEmbed().setTitle('No arguments provided').setColor(c.embed.error)
                    .setDescription(stripIndents`You must specify the url to the song you wish to play.
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

        queue.queue(
            new Song({
                url: args.url.toString(),
                channel: msg.channel,
            })
        );
    }
};
