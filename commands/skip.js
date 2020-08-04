const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { c } = require('../settings.json');
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
        let player = this.client.players.get(msg.guild.id);

        if (!player) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Error')
                    .setColor(c.embed.error)
                    .setDescription('I am not in a voice channel.')
            );
            return;
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

        player.skip(args.by);

        if (!player.requests.length) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Queue skipped to end')
                    .setColor(c.embed.warning)
                    .setDescription("Warning: You've skipped to the end of the queue")
            );
        }
    }
};
