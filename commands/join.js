const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const Player = require('../MusicPlayer');

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

        const player = this.client.players.get(msg.guild.id);
        if (player) player.join(msg.member.voice.channel);
        else this.client.players.set(msg.guild.id, new Player(msg.member.voice.channel));
    }
};
