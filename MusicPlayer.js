const ytdl = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');

const { c } = require('./settings.json');

module.exports = class MusicPlayer {
    constructor(channel) {
        this.channel = channel;
        this.channel.join().then((connection) => {
            this.connection = connection;
        });

        this.current;
        this.upcoming = [];
        this.dispatcher; // Dispatcher for the current song

        this.human_volume = 50;
    }

    join(channel) {
        this.channel = channel;
        this.channel.join().then((connection) => {
            this.connection = connection;
        });
    }

    play() {
        this.current = this.upcoming.shift();

        if (!this.current) return;

        ytdl(this.current.url).then((stream) => {
            const dispatcher = this.connection.play(stream, {
                quality: 'highestaudio',
                type: 'opus',
            });
            dispatcher.setVolumeLogarithmic(this.human_volume / 100);

            this.dispatcher = dispatcher;

            this.current.channel.send(
                new MessageEmbed()
                    .setColor(c.embed.info)
                    .setDescription(
                        `Now playing **[${this.current.info.title}](${this.current.url})**`
                    )
            );

            dispatcher.on('finish', () => {
                if (this.upcoming[0]) this.play(this.upcoming[0]);
            });
        });
    }

    queue(song) {
        this.upcoming.push(song);
        if (!this.current) this.play();
    }

    skip(by) {
        if (this.dispatcher) this.dispatcher.destroy();

        this.play();
        this.upcoming = this.upcoming.slice(by);
    }

    remove(index) {
        this.upcoming.splice(index, 1);
    }

    clearQueue() {
        this.upcoming = [];
    }

    disconnect() {
        this.clearQueue();
        this.dispatcher.destroy();
        this.connection.disconnect();
    }

    setVolume(vol) {
        this.human_volume = vol;
        if (this.dispatcher) this.dispatcher.setVolumeLogarithmic(this.human_volume / 100);
    }
};
