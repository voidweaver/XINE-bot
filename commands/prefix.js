const { Command } = require('discord-akairo');

const { MessageEmbed } = require('discord.js');

const { c, prefix } = require('../settings.json');
const Util = require('../util');

const { oneLine } = require('common-tags');

module.exports = class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: 'util',
            args: [
                {
                    id: 'prefix'
                }
            ],
            channel: 'guild'
        });
    }

    async exec(msg, args) {
        const current_prefix = this.client.settings.get(msg.guild.id, 'prefix', '%');

        if (!args.prefix) {
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Prefix info')
                    .setColor(c.embed.info)
                    .setDescription(
                        `The current prefix for this server is ${Util.toInlineCode(
                            current_prefix
                        )}.`
                    )
            );
            return;
        }

        if (args.prefix == 'default') {
            args.prefix = prefix;
        }

        if (args.prefix.match(/^[A-Za-z0-9]+$/))
            msg.channel.send(
                new MessageEmbed()
                    .setTitle('Unconventional Prefix Warning')
                    .setColor(c.embed.warning)
                    .setDescription(
                        oneLine`Setting the prefix to alphanumeric characters is generally not recommended, but proceeding anyway.
                        You can bypass the prefix any time by mentioning me: [${this.client.user} prefix %]`
                    )
            );

        await this.client.settings.set(msg.guild.id, 'prefix', args.prefix);
        msg.channel.send(
            new MessageEmbed()
                .setTitle('Prefix changed')
                .setColor(c.embed.info)
                .setDescription(
                    oneLine`Prefix changed from ${Util.toInlineCode(current_prefix)} to
                    ${Util.toInlineCode(args.prefix)}.`
                )
        );
    }
};
