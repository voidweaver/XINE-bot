const ytdl = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');

module.exports = class MusicPlayer {
    constructor(channel) {
        this.channel = channel;
        this.channel.join().then((connection) => {
            this.connection = connection;
        });

        this.requests = [];
        this.dispatcher; // Dispatcher for the current song

        this.volume = 1;
    }

    join(channel) {
        this.channel = channel;
        this.channel.join().then((connection) => {
            this.connection = connection;
        });
    }

    play(song) {
        ytdl(song.url).then((stream) => {
            const dispatcher = this.connection.play(stream, {
                quality: 'highestaudio',
                type: 'opus',
            });
            dispatcher.setVolumeLogarithmic(this.volume);

            this.dispatcher = dispatcher;

            song.channel.send(
                new MessageEmbed().setDescription(
                    `Now playing **[${song.info.title}](${song.url})**`
                )
            );

            dispatcher.on('finish', () => {
                this.requests.shift();
                if (this.requests[0]) this.play(this.requests[0]);
            });
        });
    }

    queue(song) {
        this.requests.push(song);
        if (this.requests.length == 1) this.play(this.requests[0]);
    }

    skip(by) {
        if (this.dispatcher) this.dispatcher.end();

        this.requests = this.requests.slice(by);
        if (this.requests.length == 1) this.play(this.requests[0]);
    }

    remove(index) {
        this.requests.splice(index, 1);
    }

    clearQueue() {
        this.requests = [];
    }

    disconnect() {
        this.clearQueue();
        this.dispatcher.end();
        this.connection.disconnect();
    }

    setVolume(vol) {
        this.volume = vol;
        if (this.dispatcher) this.dispatcher.setVolumeLogarithmic(this.volume);
    }
};
