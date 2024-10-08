import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Remove extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "remove",
            description: {
                content: "Removes the specific song from queue.",
                examples: ["remove 1"],
                usage: "remove <song number>",
            },
            category: "Music",
            aliases: ["rm"],
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
                    name: "song",
                    description: "Removes the specific song from Queue.",
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const embed = this.client.embed();

        if (!player.queue.length) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, Music queue is empty!`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        const songNumber = Number(args[0]);
        if (isNaN(songNumber) || songNumber <= 0 || songNumber > player.queue.length) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, No song was found at position: \`${songNumber}\`.`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        player.remove(songNumber - 1);
        embed.setColor(this.client.color.main)
            .setDescription(`**${ctx.author.tag}**, I have removed **${player.queue[songNumber]}** from Music Queue.`)
        return await ctx.sendMessage({
            embeds: [embed],
        });
    }
}