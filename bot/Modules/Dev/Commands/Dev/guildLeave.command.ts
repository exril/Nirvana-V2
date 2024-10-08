import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import os from "node:os";
import { version } from "discord.js";
import { showTotalMemory, usagePercent } from "node-system-stats";

export default class GuildLeave extends Command {
    constructor(client: Bot) {
        super(client, {
            name: 'guildleave',
            description: {
                content: 'Leaves a specific guild.',
                examples: ['gleave'],
                usage: '<guild_Id>',
            },
            category: 'Dev',
            aliases: ['gleave'],
            cooldown: 3,
            args: true,
            isPremium: false,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: false,
            options: [],
        })
    }
    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        const guildId = args[0]
        const guild = await this.client.guilds.fetch(guildId).catch(err => { });
        if (!guild) return ctx.sendMessage("Can't Fetch That Guild.")
        let embed = this.client
            .embed()
            .setTitle(`Left - ${guild.name}`)
            .setColor(this.client.color.main)
            .addFields(
                {
                    name: `Guild Id`,
                    value: `\`\`\`css\n${guildId}\`\`\``
                },
                {
                    name: `Owner Id`,
                    value: `\`\`\`css\n${guild.ownerId}\`\`\``
                })
            .setTimestamp()
        ctx.sendMessage({
            embeds: [embed]
        }).then(() => { guild.leave() })
    }
}