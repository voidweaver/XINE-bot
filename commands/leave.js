const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { c } = require('../settings.json');

module.exports = class LeaveCommand extends Command {
    constructor() {
        super('leave', {
            aliases: ['leave', 'quit', 'dc'],
            category: 'music',
            args: [],
            channel: 'guild',
        });
    }

    exec(msg) {
        if (!msg.guild.voice || !msg.guild.voice.connection) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Error')
                    .setColor(c.embed.error)
                    .setDescription('I am not in a voice channel.')
            );
        }

        let queue = this.client.queues.get(msg.guild.id);

        if (queue) queue.disconnect();

        if (msg.guild.voice.channel) {
            msg.guild.voice.channel.leave();
        }
    }
};
