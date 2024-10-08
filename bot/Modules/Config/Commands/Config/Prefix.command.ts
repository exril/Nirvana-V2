import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Prefix extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "prefix",
      description: {
        content: "Shows or sets the bot's prefix",
        examples: ["prefix set !", "prefix reset"],
        usage: "[set <prefix> | reset]",
      },
      category: "Config",
      aliases: ["prefix"],
      cooldown: 3,
      args: true,
      player: {
        voice: false,
        dj: false,
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
          name: "set",
          description: "Sets the prefix",
          type: 1,
          options: [
            {
              name: "prefix",
              description: "The prefix you want to set",
              type: 3,
              required: true,
            },
          ],
        },
        {
          name: "reset",
          description: "Resets the prefix to the default one",
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
    const guildId = ctx.guild.id;
    const isInteraction = ctx.isInteraction;
    let subCommand = "";
    let prefix = "";
    if (isInteraction) {
      subCommand = ctx.interaction.options.data[0].name;
      prefix = await ctx.interaction.options.data[0].options[0]?.value.toString();
    } else {
      subCommand = args[0] || "";
      prefix = args[1] || "";
    }
    switch (subCommand) {
      case "set": {
        if (!prefix) {
          const currentPrefix = await this.client.db.getPrefix(guildId);
          embed.setDescription(
            `The prefix for this server is \`${currentPrefix}\`\n **Note:**\n- To change prefix -> \`${currentPrefix}prefix set <new prefix>\`\n- To reset prefix -> \`${currentPrefix}prefix reset\``
          );
          embed.setTimestamp();
          return await ctx.sendMessage({ embeds: [embed] });
        }

        if (prefix.length > 3) {
          embed.setDescription(
            "The prefix cannot be longer than 3 characters."
          );
          embed.setTimestamp();
          return await ctx.sendMessage({ embeds: [embed] });
        }

        await this.client.db.setPrefix(guildId, prefix);
        embed.setDescription(`The prefix for this server is now \`${prefix}\``);
        embed.setTimestamp();
        return await ctx.sendMessage({ embeds: [embed] });
      }

      case "reset": {
        const defaultPrefix = this.client.config.prefix;
        await this.client.db.deletePrefix(guildId);
        embed.setDescription(
          `The prefix for this server is now \`${defaultPrefix}\``
        );
        embed.setTimestamp();
        return await ctx.sendMessage({ embeds: [embed] });
      }

      default: {
        const currentPrefix = await this.client.db.getPrefix(guildId);
        embed.setDescription(
          `The prefix for this server is \`${currentPrefix}\`\n **Note:**\n- To change prefix -> \`${currentPrefix}prefix set <new prefix>\`\n- To reset prefix -> \`${currentPrefix}prefix reset\``
        );
        embed.setTimestamp();
        return await ctx.sendMessage({ embeds: [embed] });
      }
    }
  }
}