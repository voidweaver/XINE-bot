const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { c } = require('../settings.json');
const { capitalize } = require('../util');

module.exports = class InfoCommand extends Command {
    constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'info', 'uinf', 'uinfo'],
            category: 'util',
            args: [
                {
                    id: 'user',
                    type: 'relevant'
                }
            ]
        });
    }

    exec(msg, args) {
        if (!args.user) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Error')
                    .setColor(c.embed.error)
                    .setDescription('Cannot find user')
            );
            return;
        }

        let embed = new MessageEmbed();
        msg.channel.send(
            new MessageEmbed()
                .setTitle('User Info')
                .setColor(c.embed.info)
                .addField('Tag', args.user.tag)
                .addField('ID', args.user.id)
                .addField('Status', capitalize(args.user.presence.status), true)
                .addField('Race', args.user.bot ? 'Human' : 'Bot', true)
                .setThumbnail(args.user.displayAvatarURL())
        );
    }
};
