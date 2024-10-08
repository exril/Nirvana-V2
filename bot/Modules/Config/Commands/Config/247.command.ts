import { GuildMember } from "discord.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";

export default class _247 extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "247",
      description: {
        content: "enables/disables 24/7 mode",
        examples: ["247 enable", "247 disable"],
        usage: "[enable | disable]",
      },
      category: "Config",
      aliases: ["24/7"],
      cooldown: 3,
      args: true,
      player: {
        voice: true,
        dj: true,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: ["ManageGuild"],
      },
      slashCommand: true,
      options: [
        {
          name: "enable",
          description: "enables 24/7 mode.",
          type: 1,
        },
        {
          name: "disable",
          description: "disables 24/7 mode.",
          type: 1,
        },
      ],
    });
  }
  public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
    const embed = this.client
      .embed()
      .setColor(this.client.color.main)
      .setAuthor({
        name: this.client.user.username,
        iconURL: this.client.user.avatarURL(),
      });
    const isInteraction = ctx.isInteraction;
    let subCommand = "";
    if (isInteraction) {
      subCommand = ctx.interaction.options.data[0].name;
    } else {
      subCommand = args[0] || "";
    }
    const member = ctx.member as GuildMember;
    if (!member.voice.channel) {
      return await ctx.sendMessage({
        embeds: [embed.setDescription("you need to be in a voice channel to run this command.").setColor(client.color.red).setAuthor({ name: ctx.client.user.username, iconURL: ctx.client.user.displayAvatarURL() })],
      });
    }
    await this.client.db.set247(member.voice.channel.id,ctx.channel.id,ctx,subCommand);
  }
}
