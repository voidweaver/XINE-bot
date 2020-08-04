const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { c } = require('../settings.json');
const MusicQueue = require('../MusicQueue');

module.exports = class SkipCommand extends Command {
    constructor() {
        super('skip', {
            aliases: ['skip', 's'],
            category: 'music',
            args: [
                {
                    id: 'by',
                    type: 'integer',
                    default: 1,
                },
            ],
            channel: 'guild',
        });
    }

    async exec(msg, args) {
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

        if (args.by < 0) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Cannot skip')
                    .setColor(c.embed.error)
                    .setDescription(`Could not possibly skip by ${args.by}`)
            );
            return;
        }

        if (!queue) {
            throw new Error('Queue not found despite creation');
        }

        queue.skip(args.by);

        if (!queue.requests.length) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Queue skipped to end')
                    .setColor(c.embed.warning)
                    .setDescription("Warning: You've skipped to the end of the queue")
            );
        }
    }
};
