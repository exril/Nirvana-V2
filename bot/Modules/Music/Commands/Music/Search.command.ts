import { LoadType } from "shoukaku";
import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";
import { Emoji } from "../../../../utils/Emotes.utils.js";
import { Song } from "../../Dispatcher.music.js";

export default class Search extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "search",
            description: {
                content: "Get multiple songs results from youtube!",
                examples: ["search example"],
                usage: "search <song>",
            },
            category: "Music",
            aliases: ["searchmusic"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: true,
                dj: false,
                active: false,
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
                    description: "Get multiple song results from youtube!",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        let player = client.queue.get(ctx.guild!.id);
        const query = args.join(" ");
        if (!player) {
            const vc = ctx.member as any;
            player = await client.queue.create(
                ctx.guild,
                vc.voice.channel,
                ctx.channel,
                client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
            );
        }
        const res = await this.client.queue.search(query);
        if (!res) {
            let embed = this.client
                .embed()
                .setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, No results found for your search: **${query}**`)
            return await ctx.sendMessage({
                embeds: [embed]
            });
        }
        const embed =
            this.client.embed()
        const compo = [
            {
                type: 2,
                style: 2,
                custom_id: "1",
                emoji: "1️⃣"
            },
            {
                type: 2,
                style: 2,
                custom_id: "2",
                emoji: "2️⃣"
            },
            {
                type: 2,
                style: 2,
                custom_id: "3",
                emoji: "3️⃣"
            },
            {
                type: 2,
                style: 2,
                custom_id: "4",
                emoji: "4️⃣"

            },
            {
                type: 2,
                style: 2,
                custom_id: "5",
                emoji: "5️⃣"
            }
        ];
        const compos = [
            {
                type: 2,
                style: 5,
                label: "Enjoying Nirvana ? Vote Now !",
                url: "https://top.gg/bot/1044688839005966396/vote",
                emoji: Emoji.vote
            }
        ]

        switch (res.loadType) {
            case LoadType.ERROR:
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.red)
                            .setDescription(`**${ctx.author.tag}**, An **Error** arised while searching for your Query!`)],
                });
                break;
            case LoadType.EMPTY:
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.red)
                            .setDescription(`**${ctx.author.tag}**,  No search results were found for your query: **${query}**`)],
                });
                break;
            case LoadType.SEARCH: {
                const tracks = res.data.slice(0, 5);
                const SearchResults = tracks.map(
                    (track: Song, index: number) =>
                        `\`[${index + 1}]\` | [${track.info.title}](${track.info.uri}) (\`${this.client.botfunctions.formatTime(track.info.length)}\`)`,
                );
                await ctx.sendMessage({
                    embeds: [
                        embed
                            .setAuthor({ name: `${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
                            .setTitle("Select Tracks You Want To Add To The Queue.")
                            .setColor(this.client.color.main)
                            .setDescription(SearchResults.join("\n"))
                    ],
                    components: [
                        {
                            type: 1,
                            components: compo
                        }
                    ],
                });
                break;
            }
        }
        const collector = ctx.channel.createMessageComponentCollector({
            filter: (f: any) => f.user.id === ctx.author.id,
            max: 1,
            time: 60000,
            idle: 60000 / 2,
        });
        collector.on("collect", async (int: any) => {
            const track = res.data[parseInt(int.customId) - 1];
            await int.deferUpdate();
            if (!track) return;
            const song = player.buildTrack(track, ctx.author);
            player.queue.push(song);
            player.isPlaying();
            await ctx.editMessage({
                embeds: [
                    embed
                        .setTitle(null)
                        .setAuthor({ name: `Position - #${player.queue.length}`, iconURL: client.user.displayAvatarURL() })
                        .setDescription(`Added [${song.info.title}](${song.info.uri}) (\`${this.client.botfunctions.formatTime(song.info.length)}\`) To Music Queue.`)
                ],
                components: [
                    {
                        type: 1,
                        components: compos
                    }
                ],
            });
            return collector.stop();
        });
        collector.on("end", async () => {
            await ctx.editMessage({
                components: [
                    {
                        type: 1,
                        components: compos
                    }
                ]
            });
        });
    }
}
