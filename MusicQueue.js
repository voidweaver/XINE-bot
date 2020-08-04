const ytdl = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');

module.exports = class MusicQueue {
    constructor(connection) {
        this.connection = connection;
        this.requests = [];
        this.dispatcher; // Dispatcher for the current song

        this.volume = 1;
    }

    play(song) {
        ytdl(song.url).then((stream) => {
            const dispatcher = this.connection.play(stream, {
                type: 'opus',
            });
            dispatcher.setVolumeLogarithmic(this.volume);

            this.dispatcher = dispatcher;

            song.channel.send(new MessageEmbed().setTitle('Playing '));

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

    clearQueue() {
        this.requests = [];
    }

    disconnect() {
        this.clearQueue();
        this.dispatcher.end();
        this.dispatcher = null;
        this.connection.disconnect();
    }

    getInfos() {
        return this.requests.map((song) => {
            return song.info;
        });
    }

    setVolume(vol) {
        this.volume = vol;
        if (this.dispatcher) this.dispatcher.setVolumeLogarithmic(this.volume);
    }
};
