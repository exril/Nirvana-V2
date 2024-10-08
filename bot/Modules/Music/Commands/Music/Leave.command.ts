import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";
import { REST } from "discord.js";

export default class Leave extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "leave",
      description: {
        content: "Leaves the voice channel",
        examples: ["leave"],
        usage: "leave",
      },
      category: "Music",
      aliases: ["l", "dc"],
      cooldown: 3,
      args: false,
      player: {
        voice: true,
        dj: true,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ReadMessageHistory",
          "ViewChannel",
          "EmbedLinks",
        ],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }

  public async run(client: Bot, ctx: Context): Promise<any> {
    const player = client.queue.get(ctx.guild!.id);
    const embed = this.client.embed();
    const rest = new REST({
      version: "10",
    }).setToken(this.client.config.token);
    if (player) {
      const channelId = player.node.manager.connections.get(
        ctx.guild!.id
      )!.channelId;
      player.destroy();
      await rest.put(`/channels/${channelId}/voice-status`, {
        body: {
          status: ``,
        },
      });
      embed
        .setColor(this.client.color.main)
        .setDescription(`Power Off! Left <#${channelId}> & cleared the queue.`)
        .setFooter({
          text: `${ctx.author.tag}`,
          iconURL: ctx.author.displayAvatarURL(),
        });
      return await ctx.sendMessage({
        embeds: [embed],
      });
    }
    embed
      .setColor(this.client.color.main)
      .setDescription(
        `**${ctx.author.tag}**, I'm not connected to any voice channel!`
      );
    return await ctx.sendMessage({
      embeds: [embed],
    });
  }
}
