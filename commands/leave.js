const { Command } = require('discord-akairo');

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
        const player = this.client.players.get(msg.guild.id);

        if (player) player.disconnect();
    }
};
