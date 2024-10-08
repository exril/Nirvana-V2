import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Queue extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "queue",
            description: {
                content: "Shows Music Queue List",
                examples: ["queue"],
                usage: "queue",
            },
            category: "Music",
            aliases: ["q"],
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
        const player = client.queue.get(ctx.guild!.id);

        if (player.queue.length === 0) {
            let embed = this.client
                .embed()
                .setColor(this.client.color.main)
                .setDescription(`Now Playing: \n [${player.current.info.title}](${player.current.info.uri}) [\`${this.client.botfunctions.formatTime(player.current.info.length)}\`] — ${player.current.info.requester}`)
                .setThumbnail(player.current.info.artworkUrl)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }
        const SongsList = [];
        for (let i = 0; i < player.queue.length; i++) {
            const track = player.queue[i];
            SongsList.push(`\`[${i + 1}]\` | [${track.info.title}](${track.info.uri}) (\`${this.client.botfunctions.formatTime(track.info.length)}\`) — ${track.info.requester}`)
        }

        let chunks = this.client.botfunctions.chunk(SongsList, 10);
        if (chunks.length === 0)
            chunks = [SongsList];

        const pages = chunks.map((chunk, index) => {
            return this.client
                .embed()
                .setColor(this.client.color.main)
                .setAuthor({ name: `${ctx.guild.name}'s Music Queue`, iconURL: ctx.guild.iconURL({}) })
                .setDescription(chunk.join("\n"))
                .setFooter({ text: `Viewing Page ${index + 1}/${chunks.length} | Queue Length: ${player.queue.length}`, iconURL: client.user.displayAvatarURL() });
        });
        return await this.client.botfunctions.paginate(client, ctx, pages);
    }
}
