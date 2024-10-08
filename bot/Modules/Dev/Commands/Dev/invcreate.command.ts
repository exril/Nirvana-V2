import { ChannelType } from "discord.js";
import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class CreateInvite extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "invitecreate",
      description: {
        content: "Create a invite link for a guild",
        examples: ["createinvite 0000000000000000000"],
        usage: "createinvite <guildId>",
      },
      category: "dev",
      aliases: ["ci"],
      cooldown: 3,
      args: true,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: true,
        client: [
          "SendMessages",
          "CreateInstantInvite",
          "ReadMessageHistory",
          "ViewChannel",
        ],
        user: [],
      },
      slashCommand: false,
      options: [],
    });
  }

  public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
    const guildId = args[0];
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      return await ctx.sendMessage("Guild not found.");
    }

    try {
      const textChannel = guild.channels.cache.find(
        (channel) => channel.type === ChannelType.GuildText
      );
      if (!textChannel) {
        return await ctx.sendMessage("No text channel found in the guild.");
      }

      let text;
      guild.channels.cache.forEach((c) => {
        if (c.type === ChannelType.GuildText && !text) text = c;
      });
      const invite = await text.createInvite({
        reason: `For ${this.client.user.tag} Developer(s)`,
        maxAge: 0,
      });

      await ctx.author.send({
        embeds: [
          this.client.embed().addFields({
            name: `${guild.name}`,
            value: `${invite.url}`,
          }),
        ],
      });
      await ctx.message.react("✅");
    } catch (_error) {
      await ctx.sendMessage("Failed to create invite link!");
    }
  }
}
