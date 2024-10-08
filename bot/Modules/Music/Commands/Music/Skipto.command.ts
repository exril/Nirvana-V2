import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Skipto extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "skipto",
            description: {
                content: "Skips to the desired song number in queue.",
                examples: ["skipto 3"],
                usage: "skipto <number>",
            },
            category: "Music",
            aliases: ["skiptomusic"],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: "number",
                    description: "Skips to the desired song number in queue.",
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const embed = this.client.embed();
        const num = Number(args[0]);

        if (!player.queue.length || isNaN(num) || num > player.queue.length || num < 1) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, Invalid Song Number Provided!\n Usage: >skipto <song # in queue>`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        player.skip(num);
        embed.setColor(this.client.color.main)
            .setDescription(`**${ctx.author.tag}**, I've **Skipped** to the song in position \`${num}\``)
        return await ctx.sendMessage({
            embeds: [embed],
        });
    }
}
