import { ClientOptions, Collection, GatewayIntentBits, EmbedBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { Api } from '@top-gg/sdk';
import BaseClient from '../Structures/BaseClient.structure.js';
import { EventListener } from '../Handlers/Event.handler.js';
import { ClientFunctions } from '../utils/Functions.utils.js';
import { DokdoOptions } from 'dokdo';

const gib: any = GatewayIntentBits;

import config from '../config.json' with { type: 'json' };
import { ShoukakuClient } from '../Modules/Music/Shoukaku.music.js';
import { Queue } from '../Modules/Music/Queue.music.js';
import DataBase from '../Database/manager.database.js';
import GuildSchema from '../Database/Schemas/Guild.schema.js';
import { ModuleHandler } from '../Handlers/Module.handler.js';

interface configOptions {
    [key: string]: any;
}

const options: ClientOptions = {
    failIfNotExists: true,
    allowedMentions: {
        parse: ['roles', 'users'],
        repliedUser: false,
    },
    intents: [
        gib.Guilds,
        gib.GuildVoiceStates,
        gib.GuildMessages,
        gib.GuildMembers,
        gib.GuildMessageTyping,
        gib.MessageContent,
    ],
};

export class Bot extends BaseClient {
    public color = {
        red: 0xd3e7f3,
        green: 0xd3e7f3,
        blue: 0xd3e7f3,
        yellow: 0xd3e7f3,
        main: 0xd3e7f3,
    };
    public topGG = new Api(config.topggapi, this);
    public body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    public botfunctions: ClientFunctions = new ClientFunctions(this);
    public cooldown: Collection<string, any> = new Collection();
    public commands: Collection<string, any> = new Collection();
    public aliases: Collection<string, any> = new Collection();
    public config: configOptions;
    public shoukaku: ShoukakuClient;
    public queue: Queue = new Queue(this);
    public db: DataBase;
    public dokdo: any; // Declare Dokdo variable

    public constructor() {
        super(options);
        this.config = config;
        this.db = new DataBase(this);
        // Initialize Dokdo with prefix and owners from config
        const DokdoHandler = new this.dokdo(Bot, {
            aliases: ['dokdo', 'dok', 'jsk'],
            prefix: [''],
          });
        this.setupbot();
    }

    public embed(): EmbedBuilder {
        return new EmbedBuilder();
    }

    private async getNodes(): Promise<any> {
        const params = new URLSearchParams({
            ssl: 'false',
            version: 'v4',
            format: 'shoukaku',
        });

        const res = await fetch(`https://lavainfo-api.deno.dev/nodes?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const nodes = await res.json();
        return nodes;
    }

    public async setupbot(): Promise<void> {
        const nodes = this.config.nodes;
        this.shoukaku = new ShoukakuClient(this, nodes);

        await new EventListener(this).loadEvents();
        await new ModuleHandler(this).loadModules();

        // Add event listener for Dokdo on messageCreate
        this.on('messageCreate', (message) => {
            if (message.author.bot) return; // Ignore bot messages
            this.dokdo.run(message); // Run Dokdo for admin commands
        });
    }

    public async load247(): Promise<void> {
        this.logger.log('24/7', 'Loading all 24/7 data for all guilds...');
        const data = await GuildSchema.find({});
        if (!data) return;

        data.forEach(async (guild) => {
            if (guild._247.isEnabled) {
                const player = this.queue.get(guild.id);
                if (!player) {
                    const presentguild = await this.guilds.fetch(guild.guildId).catch(err => {});
                    const voice = await this.channels.fetch(guild._247.voice_id).catch(err => {});
                    const text = await this.channels.fetch(guild._247.text_id).catch(() => {});
                    if (presentguild && voice && text) {
                        await this.queue.create(presentguild, voice, text);
                    }
                }
            }
        });

        this.logger.log('24/7', 'Loaded all 24/7 Guilds');
    }
}