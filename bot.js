const { Collection } = require('discord.js');
const Akairo = require('discord-akairo');
const MongooseProvider = require('./providers/MongooseProvider');

const model = require('./model');
const { token, ownerID } = require('./auth.json');

class XINE extends Akairo.AkairoClient {
    constructor() {
        super({
            ownerID: ownerID,
        });

        this.commandHandler = new Akairo.CommandHandler(this, {
            directory: './commands/',
            prefix: (msg) => {
                if (msg.guild) return this.settings.get(msg.guild.id, 'prefix', '%');
                return '%';
            },
            allowMention: true,
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler = new Akairo.ListenerHandler(this, {
            directory: './listeners/',
        });

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

        this.settings = new MongooseProvider(model);

        this.players = new Collection();
    }

    async login(token) {
        await this.settings.init();
        return super.login(token);
    }
}

const client = new XINE();

client.login(token);
