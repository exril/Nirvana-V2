import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import os from "node:os";
import { version } from "discord.js";
import { showTotalMemory, usagePercent } from "node-system-stats";

export default class Stats extends Command {
    constructor(client: Bot) {
        super(client, {
            name: 'stats',
            description: {
                content: 'The stats info of the bot.',
                examples: ['stats'],
                usage: 'stats',
            },
            category: 'Info',
            aliases: ['performance', 'ping'],
            cooldown: 3,
            args: false,
            isPremium: false,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        })
    }
    public async run(client: Bot, ctx: Context): Promise<any> {
        const osUptime = this.client.botfunctions.formatTime(os.uptime());
        const memTotal = showTotalMemory(true);
        const memUsed = (process.memoryUsage().rss / 1024 ** 2).toFixed(2);
        let embed = this.client
            .embed()
            .setTitle(`🛰 Technical data:`)
            .setColor(this.client.color.main)
            .addFields(
                {
                    name: `API Latency`,
                    value: `\`\`\`css\n${Math.round(ctx.client.ws.ping)}ms\`\`\``
                },
                {
                    name: `Uptime`,
                    value: `\`\`\`css\n${osUptime}ms\`\`\``
                },
                {
                    name: `Memory Usage`,
                    value: `\`\`\`css\n${memUsed} MB of ${memTotal} GB\`\`\``
                })
            .setTimestamp()
        ctx.sendMessage({
            embeds: [embed]
        })
    }
}