const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const MusicQueue = require('../MusicQueue');

module.exports = class JoinCommand extends Command {
    constructor() {
        super('join', {
            aliases: ['join'],
            category: 'music',
            args: [],
            channel: 'guild',
        });
    }

    async exec(msg) {
        if (!msg.member.voice.channel) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Error')
                    .setColor(c.embed.error)
                    .setDescription('You are not in a voice channel.')
            );
            return;
        }

        const connection = await msg.member.voice.channel.join();

        const queue = this.client.queues.get(msg.guild.id);
        if (queue) this.connection = connection;
        else this.client.queues.set(msg.guild.id, new MusicQueue(connection));
    }
};
