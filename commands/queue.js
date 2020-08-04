const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

const { c } = require('../settings.json');
const MusicQueue = require('../MusicQueue');
const { humanTime, visualPadBack } = require('../util');

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
        if (!msg.guild.voice || !msg.guild.voice.connection) {
            if (!msg.member.voice.channel) {
                msg.channel.send(
                    new MessageEmbed()
                        .setTitle('Error')
                        .setColor(c.embed.error)
                        .setDescription('You and I am not in a voice channel.')
                );
                return;
            }

            const connection = await msg.member.voice.channel.join();

            const queue = this.client.queues.get(msg.guild.id);
            if (!queue) this.client.queues.set(msg.guild.id, new MusicQueue(connection));
        }

        let queue = this.client.queues.get(msg.guild.id);

        if (!queue) {
            throw new Error('Queue not found despite creation');
        }

        const songs_embed = new MessageEmbed().setTitle('Queue Information').setColor(c.embed.info);

        let items = '';
        let titles = '';

        let current;

        let queue_infos = queue.getInfos();

        if (queue_infos.length) {
            queue_infos.forEach((info, i) => {
                if (i == 0) {
                    current = info;
                    return;
                }

                items += `**${i}**`.padStart(31, '‎ ') + '\n';
                titles +=
                    visualPadBack(
                        `**[${info.title}](${info.url})** (${humanTime(info.length)})`,
                        40 + 28 + 4 + 4
                    ) + '\n';
            });

            songs_embed.setDescription(stripIndent`
                :musical_note:‎ ‎ **Currently Playing:
                [${current.title}](${current.url})** (${humanTime(current.length)})
            `);
        } else {
            songs_embed.setDescription(`:no_entry_sign:‎ ‎ **Not currently playing any song**`);
        }

        if (items) {
            songs_embed.addField('Up next:', items, true);
            songs_embed.addField('‎', titles, true);
            songs_embed.addField('‎', '‎', true);
        } else {
            songs_embed.addField('Up next:', 'Nothing up next. Try requesting some songs!');
        }

        msg.channel.send(songs_embed);
    }
};
