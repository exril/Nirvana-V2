/* eslint-disable no-unused-vars */
import { Bot } from '../Clients/Bot.client.js';

interface EventOptions{
    name:string;
    once?:boolean;
}
export default class Event{
    public client:Bot;
    public once:boolean;
    public file: string;
    public name: string;
    public fileName: string;
    constructor(client: Bot, file: string, options: EventOptions) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.once = options.once || false;
        this.fileName = file.split('.')[0];
    }
    public async run(..._args: any[]): Promise<any> {
        return await Promise.resolve();
    }
}