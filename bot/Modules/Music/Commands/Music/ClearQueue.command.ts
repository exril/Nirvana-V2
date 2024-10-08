import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class ClearQueue extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "clearqueue",
            description: {
                content: "Clears the queue!",
                examples: ["clearqueue"],
                usage: "clearqueue",
            },
            category: "Music",
            aliases: ["cq"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Bot, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const embed = this.client.embed();

        if (!player) {
            embed.setColor(this.client.color.red)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        if (player.queue.length === 0) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, Music queue is empty!`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        player.queue = [];
        embed.setColor(this.client.color.main)
            .setDescription(`**${ctx.author.tag}**, Removed all songs from the queue!`)
        return await ctx.sendMessage({
            embeds: [embed],
        });
    }
}

