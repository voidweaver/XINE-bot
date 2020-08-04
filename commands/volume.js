const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { c } = require('../settings.json');
const Util = require('../util');

module.exports = class JoinCommand extends Command {
    constructor() {
        super('volume', {
            aliases: ['volume', 'vol'],
            category: 'music',
            args: [
                {
                    id: 'level',
                    type: 'number',
                },
            ],
            channel: 'guild',
        });
    }

    exec(msg, args) {
        let player = this.client.players.get(msg.guild.id);

        const error_embed = new MessageEmbed().setColor(c.embed.error);

        const volume_given = typeof args.level === 'number' && !isNaN(args.level);

        if (volume_given) error_embed.setTitle('Error setting volume');
        else error_embed.setTitle('Error getting volume');

        if (!player) {
            error_embed.setDescription('I am not in a voice channel.');
            msg.channel.send(error_embed);
            return;
        }

        if (volume_given) {
            player.setVolume(args.level);

            msg.channel.send(
                new MessageEmbed().setDescription('Volume set').setColor(c.embed.success)
            );
        } else {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Volume info')
                    .setColor(c.embed.info)
                    .setDescription(`Current volume is ${Util.toInlineCode(player.volume)}`)
            );
        }
    }
};
