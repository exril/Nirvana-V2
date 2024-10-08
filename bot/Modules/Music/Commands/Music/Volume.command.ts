import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Volume extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "volume",
            description: {
                content: "Sets the volume of the player",
                examples: ["volume 100"],
                usage: "volume <number>",
            },
            category: "Music",
            aliases: ["vol"],
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
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "number",
                    description: "The volume you want to set",
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        const number = Number(args[0]);
        if (isNaN(number) || number < 0 || number > 200) {
            const description = isNaN(number)
                ? "Please provide me a valid number."
                : number < 0
                    ? "Oops The volume can't be lower than 0!"
                    : "Sowwy The volume can't be higher than 200!";
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.username}**, ${description}`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        await player.player.setGlobalVolume(number);
        embed.setColor(this.client.color.red)
            .setDescription(`**${ctx.author.username}**, Successfully set the volume to \`${number}%\``)
        return await ctx.sendMessage({
            embeds: [embed],
        });
    }
}
