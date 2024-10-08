import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Skip extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "skip",
      description: {
        content: "Skips the current song",
        examples: ["skip"],
        usage: "skip",
      },
      category: "Music",
      aliases: ["sk"],
      cooldown: 3,
      args: false,
      vote: false,
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
      options: [],
    });
  }

  public async run(client: Bot, ctx: Context): Promise<any> {
    const player = client.queue.get(ctx.guild.id);
    const embed = this.client.embed();

    if (player.queue.length === 0) {
      embed
        .setColor(this.client.color.red)
        .setDescription(`**${ctx.author.tag}**, Music queue is empty!`);
      return await ctx.sendMessage({
        embeds: [embed],
      });
    }

    player.skip();
    if (ctx.isInteraction) {
      embed
        .setColor(this.client.color.main)
        .setDescription(
          `**${ctx.author.tag}**, I've **Skipped** [${player.current.info.title}](${player.current.info.uri}).`
        );
      return await ctx.sendMessage({
        embeds: [embed],
      });
    }
    ctx.message?.react("⏭");
  }
}
