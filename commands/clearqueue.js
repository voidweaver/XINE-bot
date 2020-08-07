const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { c } = require('../settings.json');

module.exports = class RemoveCommand extends Command {
    constructor() {
        super('clearqueue', {
            aliases: ['clearqueue', 'clear'],
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

        player.clearQueue();

        msg.channel.send(new MessageEmbed().setTitle('Queue cleared').setColor(c.embed.success));
    }
};
