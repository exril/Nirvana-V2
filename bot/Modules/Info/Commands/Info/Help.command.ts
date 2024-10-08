import { ActionRowBuilder, StringSelectMenuBuilder } from "@discordjs/builders";
import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";
import { Emoji } from "../../../../utils/Emotes.utils.js";
import { ComponentType } from "discord.js";

export default class Help extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "help",
      description: {
        content: "Shows the bot's help command",
        examples: ["help"],
        usage: "help",
      },
      category: "Info",
      aliases: ["h"],
      cooldown: 3,
      args: false,
      isPremium: false,
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
    let user = await client.users.fetch(`1207107876058046494`);
    const command = this.client.commands.filter(
      (cmd) => cmd.category !== "Dev"
    );
    const categories = [...new Set(command.map((cmd) => cmd.category))];

    const drop = new StringSelectMenuBuilder()
      .setCustomId("c")
      .setPlaceholder("Get Info About a Particular Category")
      .addOptions(
        {
          value: "config",
          label: "Configuration",
          description: "Configure bot settings in your server.",
        },
        {
          value: "info",
          label: "Information",
          description: "Get a list of Info Commands.",
        },
        {
          value: "filter",
          label: "Music Filters",
          description: "Spice up your music with crazy filters.",
        },
        {
          value: "music",
          label: "Music",
          description: "Discover a veriety of music commands.",
        },
        {
          value: "util",
          label: "Utility",
          description: "Get a variety of Utility commands.",
        },
        {
          value: "allcmd",
          label: "All Commands",
          description: "Get a list of all commands at a Glance.",
        }
      );

    const commandsdrop =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(drop);

    const home = [
      {
        type: 2,
        style: 2,
        emoji: Emoji.home,
        custom_id: "homebut",
      },
    ];

    const compos = [
      {
        type: 2,
        style: 5,
        label: "Vote",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: Emoji.vote,
      },
      {
        type: 2,
        style: 5,
        label: "Support",
        url: "https://discord.gg/9bWCU6VPEM",
        emoji: Emoji.support,
      },
    ];

    const homeembed = this.client
      .embed()
      .setAuthor({
        name: `Nirvana Music Help Page`,
        iconURL: ctx.author.displayAvatarURL(),
      })
      //.setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `<:8319folder:1154676193354862633> : Modules\n> <:config:1292463932828549221> : Configuration\n > <:info:1292465072307835000> : Information\n > <:filter:1292465311634690091> : Filters\n > <:music:1292465868881788958> : Music\n > <:utils:1292465829056876584> : Utility\n\n <:link:1154448839483346965> [Support](https://discord.gg/BPr8tvwU) . [Vote](https://top.gg/bot/1044688839005966396/vote) . [Invite](https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot)`
      )
      .setColor(this.client.color.main)
      .setFooter({
        text: `Made By jacob`,
        iconURL: user.displayAvatarURL(),
      })
      .setFields();
    const msg = await ctx.sendMessage({
      content: "-# Note: Moderation commands has been depreciated.",
      embeds: [homeembed],
      components: [
        commandsdrop,
        {
          type: 1,
          components: compos,
        },
      ],
    });

    const embed = this.client
      .embed()
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(this.client.color.main)
      .setFooter({
        text: `Made By ${user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setFields();
    const homecollector = msg.createMessageComponentCollector({
      filter: (x: { user: { id: string }; deferUpdate: () => any }) =>
        x.user.id === ctx.author.id ? true : false && x.deferUpdate(),
      componentType: ComponentType.Button,
      time: 100000,
    });

    homecollector.on("collect", async (h) => {
      await h.deferUpdate({});
      switch (h.customId) {
        case "homebut":
          msg.edit({
            embeds: [homeembed],
            components: [
              commandsdrop,
              {
                type: 1,
                components: compos,
              },
            ],
          });
          break;
      }
    });

    homecollector.on("end", async (hend) => {
      homecollector.stop;
      await msg.edit({
        embeds: [homeembed],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            drop.setDisabled(true)
          ),
          {
            type: 1,
            components: compos,
          },
        ],
      });
    });

    const collector = msg.createMessageComponentCollector({
      filter: (x: { user: { id: string }; deferUpdate: () => any }) =>
        x.user.id === ctx.author.id ? true : false && x.deferUpdate(),
      componentType: ComponentType.StringSelect,
      time: 100000,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate({});
      switch (i.values[0]) {
        case "config":
          const configcmd = this.client.commands
            .filter((cmd) => cmd.category === "Config")
            .map((cmd) => `\`${cmd.name}\``)
            .join(" | ");
          embed.setAuthor({
            name: "Configuration Commands",
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(configcmd);
          embed.setFields();

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
          break;
        case "info":
          const infocmd = this.client.commands
            .filter((cmd) => cmd.category === "Info")
            .map((cmd) => `\`${cmd.name}\``)
            .join(" | ");
          embed.setAuthor({
            name: "Information Commands",
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(infocmd);
          embed.setFields();

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
          break;
        case "filter":
          const filtercmd = this.client.commands
            .filter((cmd) => cmd.category === "Filters")
            .map((cmd) => `\`${cmd.name}\``)
            .join(" | ");
          embed.setAuthor({
            name: "Music Filters",
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(filtercmd);
          embed.setFields();

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
          break;
        case "music":
          const musiccmd = this.client.commands
            .filter((cmd) => cmd.category === "Music")
            .map((cmd) => `\`${cmd.name}\``)
            .join(" | ");
          embed.setAuthor({
            name: "Music",
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(musiccmd);
          embed.setFields();

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
          break;
        case "mod":
          const modcmd = this.client.commands
            .filter((cmd) => cmd.category === "Moderation")
            .map((cmd) => `\`${cmd.name}\``)
            .join(" | ");
          embed.setAuthor({
            name: "Moderation",
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(modcmd);
          embed.setFields();

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
          break;
        case "util":
          const utilcmd = this.client.commands
            .filter((cmd) => cmd.category === "Utility")
            .map((cmd) => `\`${cmd.name}\``)
            .join(" | ");
          embed.setAuthor({
            name: "Utility",
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(utilcmd);
          embed.setFields();

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
          break;
        case "allcmd":
          const fields = categories.map((category) => ({
            name: category,
            value: command
              .filter((cmd) => cmd.category === category)
              .map((cmd) => `\`${cmd.name}\``)
              .join(" | "),
            inline: false,
          }));
          embed.setAuthor({
            name: `All Commands Overview`,
            iconURL: client.user.displayAvatarURL(),
          });
          embed.setDescription(null);
          embed.setFields(...fields);

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: home,
              },
            ],
          });
      }
    });

    collector.on("end", async (cend) => {
      homecollector.stop;
      await msg.edit({
        embeds: [homeembed],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            drop.setDisabled(true)
          ),
          {
            type: 1,
            components: compos,
          },
        ],
      });
    });
  }
}
