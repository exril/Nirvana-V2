import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Pause extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "pause",
            description: {
                content: "Pauses the current song",
                examples: ["pause"],
                usage: "pause",
            },
            category: "Music",
            aliases: ["pausemusic"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Bot, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();

        if (player.paused) {
            embed.setColor(this.client.color.main)
                .setDescription(`**${ctx.author.username}**, Player is already **paused**.`)
            return await ctx.sendMessage({
                embeds: [embed]
            });
        }

        player.pause();
        if (ctx.isInteraction) {
            return await ctx.sendMessage({
                content: "**Paused** The Player.",
                ephemeral: true,
            });
        }
        return await ctx.message?.react("⏸");
    }
}