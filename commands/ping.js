const { Command } = require('discord-akairo');

module.exports = class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'hello', 'hi']
        });
    }

    exec(msg) {
        msg.reply('Hello there!');
    }
};
