import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Loop extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "loop",
            description: {
                content: "Repeats the Song, Queue",
                examples: ["loop", "loop queue", "loop song"],
                usage: "loop",
            },
            category: "Music",
            aliases: ["loop"],
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
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Bot, ctx: Context): Promise<any> {
        const embed = this.client.embed().setColor(this.client.color.main);
        const player = client.queue.get(ctx.guild!.id);
        let loopMessage = "";

        switch (player?.loop) {
            case "off":
                player.loop = "repeat";
                loopMessage = `**${ctx.author.tag}**, Alright I'll be looping the **Current** song!`;
                break;
            case "repeat":
                player.loop = "queue";
                loopMessage = `**${ctx.author.tag}**, Alright I'll be looping the entire **Queue**!`;
                break;
            case "queue":
                player.loop = "off";
                loopMessage = `**${ctx.author.tag}**, Alright I've **Disabled** the loop mode!`;
                break;
        }
        embed.setDescription(loopMessage);
        return await ctx.sendMessage({
            embeds: [embed],
        });
    }
}
