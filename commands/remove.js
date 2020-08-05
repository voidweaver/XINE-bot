const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

const { c } = require('../settings.json');
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

        let technical_index = args.index - 1;

        if (technical_index < 0 || technical_index >= player.upcoming.length) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Could not remove song')
                    .setColor(c.embed.error)
                    .setDescription(`There exists no song with index ${args.index}.`)
            );
            return;
        }

        let original = player.upcoming[technical_index];
        player.remove(technical_index);

        msg.channel.send(
            new MessageEmbed()
                .setTitle('Song removed')
                .setColor(c.embed.success)
                .setDescription(`Removed **[${original.info.title}](${original.url})** from queue`)
        );
    }
};
