const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

const { c } = require('../settings.json');

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
        let queue = this.client.queues.get(msg.guild.id);

        if (!queue || !queue.requests[0]) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('No song is being played')
                    .setColor(c.embed.error)
                    .setDescription('I am not in a voice channel.')
            );
            return;
        }

        let current = queue.requests[0];

        msg.channel.send(
            new MessageEmbed().setColor(c.embed.info).setDescription(stripIndent`
                :musical_note:‎ ‎ **Currently Playing:
                [${current.title}](${current.url})** (${humanTime(current.length)})
            `)
        );
    }
};
