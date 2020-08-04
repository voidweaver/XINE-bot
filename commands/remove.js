const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

const { c } = require('../settings.json');
const MusicQueue = require('../MusicQueue');
const { getPrefix } = require('../util');

module.exports = class RemoveCommand extends Command {
    constructor() {
        super('remove', {
            aliases: ['remove', 'rm'],
            category: 'music',
            args: [
                {
                    id: 'index',
                    type: 'integer',
                },
            ],
            channel: 'guild',
        });
    }

    async exec(msg, args) {
        if (!args || typeof args.index !== 'number' || isNaN(args.index)) {
            msg.channel.send(
                new MessageEmbed().setTitle('No arguments provided').setColor(c.embed.error)
                    .setDescription(stripIndent`You must specify the index of the song you want to remove.
                    For example: ${getPrefix(this.client, msg.guild)}remove 1`)
            );
            return;
        }

        let queue = this.client.queues.get(msg.guild.id);

        if (!msg.guild.voice || !msg.guild.voice.connection) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Error')
                    .setColor(c.embed.error)
                    .setDescription('I am not in a voice channel.')
            );
            return;
        } else if (!queue) {
            this.client.queues.set(msg.guild.id, new MusicQueue(msg.guild.voice.connection));
            queue = this.client.queues.get(msg.guild.id);
        }

        if (!queue) {
            throw new Error('Queue not found despite creation');
        }

        if (args.index <= 0 || args.index >= queue.requests.length) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Could not remove song')
                    .setColor(c.embed.error)
                    .setDescription(`There exists no song with index ${args.index}.`)
            );
        }

        queue.remove(args.index);
    }
};
