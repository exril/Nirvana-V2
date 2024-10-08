// import config from '../../config.json';
import { ActivityType, REST, Routes } from 'discord.js';

import { Bot } from '../../../Clients/Bot.client.js';
import Event from '../../../Structures/Event.structure.js';
import GuildSchema from '../../../Database/Schemas/Guild.schema.js';

export default class Ready extends Event {

    constructor(client: Bot, file: string) {
        super(client, file, {
            name: 'ready',
        });
    }

    public async run(): Promise<void> {
        this.client.logger.event(`Client`, `${this.client.user?.tag} is ready!`);
        this.client.user?.setPresence({
            activities: [
                {
                    name: '/play',
                    type: ActivityType.Listening,
                },
            ],
            status: 'idle',
        });
        
        const applicationCommands = Routes.applicationCommands(this.client.user.id ?? '');
        try {
            const rest = new REST({ version: '10' }).setToken(this.client.config.token ?? '');
            await rest.put(applicationCommands, { body: this.client.body });
            this.client.logger.log('Ready Event', `Successfully loaded slash commands!`);
        } catch (error) {
            this.client.logger.error('Ready Event', error);
        }
    }
}
