import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Join extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "join",
            description: {
                content: "Joins the voice channel",
                examples: ["join"],
                usage: "join",
            },
            category: "Music",
            aliases: ["come", "j"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Bot, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        let player = client.queue.get(ctx.guild.id);

        if (player) {
            const channelId = player.node.manager.connections.get(ctx.guild.id).channelId;
            embed.setColor(this.client.color.main)
                .setDescription(`**${ctx.author.tag}**, I'm already connected to <#${channelId}> !`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        const memberVoiceChannel = (ctx.member as any).voice.channel;
        if (!memberVoiceChannel) {
            embed.setColor(this.client.color.red)
                .setDescription(`**${ctx.author.tag}**, You are not connected to any voice channel!`)
            return await ctx.sendMessage({
                embeds: [embed],
            });
        }

        player = await client.queue.create(
            ctx.guild!,
            memberVoiceChannel,
            ctx.channel,
            client.shoukaku.options.nodeResolver(client.shoukaku.nodes),
        );

        const joinedChannelId = player.node.manager.connections.get(ctx.guild!.id)!.channelId;
        embed.setColor(this.client.color.main)
            .setDescription(`Power On! Ready to play music in <#${joinedChannelId}>.`)
            .setFooter({ text: `${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
        return await ctx.sendMessage({
            embeds: [embed],
        });
    }
}