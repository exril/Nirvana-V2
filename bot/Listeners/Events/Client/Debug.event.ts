// import config from '../../config.json';
import { ActivityType, REST, Routes } from 'discord.js';

import { Bot } from '../../../Clients/Bot.client.js';
import Event from '../../../Structures/Event.structure.js';

export default class Debug extends Event {

    constructor(client: Bot, file: string) {
        super(client, file, {
            name: 'Debug',
        });
    }
    
    public async run(_client:Bot,args): Promise<void> {
        this.client.logger.debug("Client",args)
    }
}
