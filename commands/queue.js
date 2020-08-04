const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent, oneLineTrim } = require('common-tags');

const { c } = require('../settings.json');
const { humanTime } = require('../util');

module.exports = class QueueCommand extends Command {
    constructor() {
        super('queue', {
            aliases: ['queue', 'q'],
            category: 'music',
            args: [],
            channel: 'guild',
        });
    }

    async exec(msg) {
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

        const songs_embed = new MessageEmbed().setTitle('Queue Information').setColor(c.embed.info);

        let items = '';

        let current;

        let songs = player.requests;

        if (songs.length) {
            songs.forEach((song, i) => {
                if (i == 0) {
                    current = song;
                    return;
                }

                items +=
                    oneLineTrim`
                    ${'‎ '.repeat(songs.length.toString().length - i.toString().length)}
                    \`${i}\`‎ **[${song.info.title}](${song.url})** (${humanTime(
                        song.info.duration
                    )})` + '\n';
            });

            songs_embed.setDescription(stripIndent`
                :musical_note:‎ ‎ **Currently Playing:
                [${current.info.title}](${current.url})** (${humanTime(current.info.duration)})
            `);
        } else {
            songs_embed.setDescription(`:no_entry_sign:‎ ‎ **Not currently playing any song**`);
        }

        if (items) songs_embed.addField('Up next:', items, true);
        else songs_embed.addField('Up next:', 'Nothing up next. Try requesting some songs!');

        msg.channel.send(songs_embed);
    }
};
