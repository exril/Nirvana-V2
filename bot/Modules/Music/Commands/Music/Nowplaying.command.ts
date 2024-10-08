import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Nowplaying extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "nowplaying",
            description: {
                content: "Shows the currently played song!",
                examples: ["nowplaying"],
                usage: "nowplaying",
            },
            category: "Music",
            aliases: ["np"],
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
        const player = client.queue.get(ctx.guild!.id)!;
        const track = player.current!;
        const position = player.player.position;
        const duration = track.info.length;
        const bar = this.client.botfunctions.progressBar(position, duration, 20);

        const embed = this.client
            .embed()
            .setColor(this.client.color.main)
            .setAuthor({ name: `${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
            .setThumbnail(track.info.artworkUrl!)
            .setDescription(`**${track.info.title}** \n ${track.info.author} \n ▶️ ${bar} [\`${this.client.botfunctions.formatTime(position)} / ${this.client.botfunctions.formatTime(duration)}\`]`)
            .setFooter({ text: `Nirvana Music`, iconURL: client.user.displayAvatarURL() })
        return await ctx.sendMessage({
            embeds: [embed]
        });
    }
}
