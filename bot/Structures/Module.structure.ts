/* eslint-disable no-unused-vars */
import { Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { Bot } from '../Clients/Bot.client.js';
interface moduleOptions {
    name:string;
    required?:boolean;
}

export default class Module{
    public client:Bot;
    public nessary:boolean;
    public file: string;
    public name: string;
    public required: boolean;

 

    constructor(client: Bot, file: string,options: moduleOptions) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.required = options.required  || false;

    }
    public async load(..._args: any[]): Promise<any> {
        return await Promise.resolve();
    }
    public async unload(..._args: any[]): Promise<any> {
        return await Promise.resolve();
    }
}