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
                    type: 'string',
                },
            ],
            channel: 'guild',
        });
    }

    exec(msg, args) {
        let player = this.client.players.get(msg.guild.id);

        const error_embed = new MessageEmbed().setColor(c.embed.error);

        let volume = parseInt(args.level, 10);
        let absolute = true;

        if (!isNaN(volume)) error_embed.setTitle('Error setting volume');
        else error_embed.setTitle('Error getting volume');

        if (!player) {
            error_embed.setDescription('I am not in a voice channel.');
            msg.channel.send(error_embed);
            return;
        }

        if (!isNaN(volume)) {
            if (args.level.startsWith('+') || args.level.startsWith('-')) {
                volume = volume + player.human_volume;
                absolute = false;
            }

            if (volume < 0) {
                if (absolute)
                    msg.channel.send(
                        new MessageEmbed()
                            .setTitle('Invalid volume')
                            .setColor(c.embed.warning)
                            .setDescription(
                                'The volume must be from 0% to 100%, so using the minimum 0%'
                            )
                    );
                volume = 0;
            } else if (volume > 100) {
                if (absolute)
                    msg.channel.send(
                        new MessageEmbed()
                            .setTitle('Invalid volume')
                            .setColor(c.embed.warning)
                            .setDescription(
                                'The volume must be from 0% to 100%, so using the maximum 100%'
                            )
                    );
                volume = 100;
            }

            player.setVolume(volume);

            msg.channel.send(
                new MessageEmbed()
                    .setColor(c.embed.success)
                    .setDescription(`Volume set to ${Util.toInlineCode(player.human_volume + '%')}`)
            );
        } else {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Volume info')
                    .setColor(c.embed.info)
                    .setDescription(
                        `Current volume is ${Util.toInlineCode(player.human_volume + '%')}`
                    )
            );
        }
    }
};
