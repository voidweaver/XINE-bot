const ytdl = require('ytdl-core-discord');

module.exports = class Song {
    url;
    channel;

    constructor(properties) {
        Object.assign(this, properties);

        ytdl.getBasicInfo(this.url).then((info) => {
            this.info = {
                title: info.title,
                url: `https://youtu.be/${info.video_id}`,
                length: info.length_seconds,
            };
        });
    }
};
