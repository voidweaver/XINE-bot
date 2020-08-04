const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

const { c } = require('../settings.json');
const { humanTime } = require('../util');

module.exports = class NowPlayingCommand extends Command {
    constructor() {
        super('now_playing', {
            aliases: ['now_playing', 'nowplaying', 'np'],
            category: 'music',
            args: [],
            channel: 'guild',
        });
    }

    async exec(msg) {
        let player = this.client.players.get(msg.guild.id);

        if (!player || !player.requests[0]) {
            msg.channel.send(
                new MessageEmbed()
                    .setColor(c.embed.error)
                    .setDescription(':no_entry_sign:‎ ‎ **Not currently playing any song**')
            );
            return;
        }

        let current = player.requests[0];

        msg.channel.send(
            new MessageEmbed().setColor(c.embed.info).setDescription(stripIndent`
                :musical_note:‎ ‎ **Currently Playing:
                [${current.info.title}](${current.url})** (${humanTime(current.info.duration)})`)
        );
    }
};
