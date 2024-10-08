import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Seek extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "seek",
            description: {
                content: "Seeks to a certain time in the song",
                examples: ["seek 1m", "seek 1h 30m", "seek 1h 30m 30s"],
                usage: "seek <duration>",
            },
            category: "Music",
            aliases: ["seekmusic"],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: "duration",
                    description: "The duration to seek to",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const current = player.current.info;
        const position = player.player.position;
        const embed = this.client.embed();
        const duration = client.botfunctions.parseTime(args.join(" "));

        if (!duration) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, Invalid time format.\n Examples: \`seek 1m\`, \`seek 1h\`, \`seek 30m\``);
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        if (!current.isSeekable) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, The provided track is **NOT** seekable!`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        if (duration <= current.length) {
            if (duration > position) {
                player.seek(duration);
                embed.setColor(this.client.color.main)
                    .setTitle(`Seeked The Track`)
                    .setDescription(`[${current.title}](${current.uri}) - \`${this.client.botfunctions.formatTime(duration)} / ${this.client.botfunctions.formatTime(current.length)}\``)
                    .setFooter({ text: `Requested By ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
                return await ctx.sendMessage({
                    embeds: [embed],
                });
            } else {
                player.seek(duration);
                embed.setColor(this.client.color.main)
                    .setTitle(`Rewinded The Track`)
                    .setDescription(`[${current.title}](${current.uri}) - \`${this.client.botfunctions.formatTime(duration)} / ${this.client.botfunctions.formatTime(current.length)}\``)
                    .setFooter({ text: `Requested By ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
                return await ctx.sendMessage({
                    embeds: [embed]
                });
            }
        } else {
            embed.setColor(this.client.color.red)
                .setDescription(`Seek Duration Exceeds Song Duration!\n\n> Requested duration: \`${client.botfunctions.formatTime(duration)}.\`\n> Song duration: \`${client.botfunctions.formatTime(current.length)}.\``);
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }
    }
}