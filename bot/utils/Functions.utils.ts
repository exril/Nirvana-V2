import {
  EmbedBuilder,
  ColorResolvable,
  WebhookClient,
  TextChannel,
  CommandInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  Snowflake,
  User,
  Message,
} from "discord.js";
import { Bot } from "../Clients/Bot.client.js";
import Context from "../Structures/Context.structure.js";
import { config } from "process";

export class ClientFunctions {
  private client: Bot;
  constructor(client: Bot) {
    this.client = client;
  }
  /**
   * @param webhook - "command" | "error" | "node" | "event" | "player" | "misc" | "warn" | "logs"
   * @param msg - string
   */
  public async webhooklog(
    webhook:
      | "command"
      | "error"
      | "node"
      | "event"
      | "player"
      | "misc"
      | "warn"
      | "logs",
    msg: string,
    title?: string
  ): Promise<void> {
    let weebhookurl: string;
    let color: ColorResolvable;
    switch (webhook) {
      case "command":
        color = "Green";
        weebhookurl = this.client.config.webhooks.command;
        break;
      case "error":
        color = "DarkRed";
        weebhookurl = this.client.config.webhooks.error;
        break;
      case "misc":
        color = "Orange";
        weebhookurl = this.client.config.webhooks.misc;
        break;
      case "node":
        color = "DarkAqua";
        weebhookurl = this.client.config.webhooks.nodelog;
        break;
      case "event":
        color = "Blue";
        weebhookurl = this.client.config.webhooks.event;
        break;
      case "player":
        color = "DarkBlue";
        weebhookurl = this.client.config.webhooks.player;
        break;
      case "warn":
        color = "DarkGrey";
        weebhookurl = this.client.config.webhooks.warn;
        break;
      case "logs":
        color = "Blurple";
        weebhookurl = this.client.config.webhooks.logs;
        break;
    }
    //embed
    const embed = new EmbedBuilder()
      .setAuthor({
        name: title ? title : "Nirvana",
        iconURL:
          "https://cdn.discordapp.com/avatars/1044688839005966396/67f29712ed35753956e0f346d78b3422.png",
      })
      .setColor(color)
      .setDescription(msg);
    const hook = new WebhookClient({ url: weebhookurl });
    await hook.send({ embeds: [embed] });
  }

  public formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  public formatTime(ms: number): string {
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;
    if (ms < minuteMs) return `${ms / 1000}s`;
    if (ms < hourMs)
      return `${Math.floor(ms / minuteMs)}m ${Math.floor(
        (ms % minuteMs) / 1000
      )}s`;
    if (ms < dayMs)
      return `${Math.floor(ms / hourMs)}h ${Math.floor(
        (ms % hourMs) / minuteMs
      )}m`;
    return `${Math.floor(ms / dayMs)}d ${Math.floor((ms % dayMs) / hourMs)}h`;
  }
  public parseTime(string: string): number {
    const time = string.match(/([0-9]+[d,h,m,s])/g);
    if (!time) return 0;
    let ms = 0;
    for (const t of time) {
      const unit = t[t.length - 1];
      const amount = Number(t.slice(0, -1));
      if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
      else if (unit === "h") ms += amount * 60 * 60 * 1000;
      else if (unit === "m") ms += amount * 60 * 1000;
      else if (unit === "s") ms += amount * 1000;
    }
    return ms;
  }
  public progressBar(current: number, total: number, size = 25): string {
    let line = "▬";
    let slider = "🔘";
    let bar =
      current > total
        ? [line.repeat((size / 2) * 2), (current / total) * 100]
        : [
            line
              .repeat(Math.round((size / 2) * (current / total)))
              .replace(/.$/, slider) +
              line.repeat(size - Math.round(size * (current / total)) + 1),
            current / total,
          ];

    if (!String(bar).includes(slider))
      return `${slider}${line.repeat(size - 1)}`;
    return `${bar[0]}`;
  }
  public async paginate(
    client: Bot,
    ctx: Context,
    embed: any[]
  ): Promise<void> {
    if (embed.length < 2) {
      if (ctx.isInteraction) {
        ctx.deferred
          ? ctx.interaction.followUp({
              embeds: embed,
            })
          : ctx.interaction.reply({
              embeds: embed,
            });
        return;
      }
      (ctx.channel as TextChannel).send({
        embeds: embed,
      });
      return;
    }

    let page = 0;
    const getButton = (page: number): any => {
      const firstEmbed = page === 0;
      const lastEmbed = page === embed.length - 1;
      const pageEmbed = embed[page];
      const compos = [
        {
          type: 2,
          style: 2,
          emoji: "⏮",
          custom_id: "fast",
          disabled: firstEmbed,
        },
        {
          type: 2,
          style: 2,
          emoji: "⏪",
          custom_id: "back",
          disabled: firstEmbed,
        },
        {
          type: 2,
          style: 2,
          emoji: "⏹",
          custom_id: "stop",
        },
        {
          type: 2,
          style: 2,
          emoji: "⏩",
          custom_id: "next",
          disabled: lastEmbed,
        },
        {
          type: 2,
          style: 2,
          emoji: "⏭",
          custom_id: "last",
          disabled: lastEmbed,
        },
      ];
      return {
        embeds: [pageEmbed],
        components: [
          {
            type: 1,
            components: compos,
          },
        ],
      };
    };

    const msgOptions = getButton(0);
    const msg = ctx.isInteraction
      ? await (ctx.deferred
          ? ctx.interaction.followUp({
              ...msgOptions,
              fetchReply: true as boolean,
            })
          : ctx.interaction.reply({ ...msgOptions, fetchReply: true }))
      : await (ctx.channel as TextChannel).send({
          ...msgOptions,
          fetchReply: true,
        });

    const author = ctx instanceof CommandInteraction ? ctx.user : ctx.author;

    const filter = (int: any): any => int.user.id === author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id === author.id) {
        await interaction.deferUpdate();
        if (interaction.customId === "fast" && page !== 0) {
          page = 0;
        } else if (interaction.customId === "back" && page !== 0) {
          page--;
        } else if (interaction.customId === "stop") {
          collector.stop();
        } else if (
          interaction.customId === "next" &&
          page !== embed.length - 1
        ) {
          page++;
        } else if (
          interaction.customId === "last" &&
          page !== embed.length - 1
        ) {
          page = embed.length - 1;
        }
        await interaction.editReply(getButton(page));
      } else {
        await interaction.reply({
          content: "This interaction session is not for you!",
          ephemeral: true,
        });
      }
    });

    collector.on("end", async () => {
      await msg.edit({ embeds: [embed[page]], components: [] });
    });
  }
  public chunk(array: any[], size: number): any[] {
    const chunked_arr = [];
    for (let index = 0; index < array.length; index += size) {
      chunked_arr.push(array.slice(index, size + index));
    }
    return chunked_arr;
  }

  public getUser(
    ctx: { guild: { members: { fetch: (arg0: any) => any } } },
    mention: string
  ) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    const userId = matches ? matches[1] : mention;

    return ctx.guild.members.fetch(userId);
  }

  public getGlobalUser(
    ctx: { guild: { members: { fetch: (arg0: any) => any } } },
    mention: string
  ) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    const userId = matches ? matches[1] : mention;

    return this.client.users.fetch(userId);
  }

  public getImgUrlFromAttachment(msg: Message): string {
    for (const [_, att] of msg.attachments) {
      let suffix_array = [
        ".webp",
        ".png",
        ".jpg",
        ".jpeg",
        ".WEBP",
        ".PNG",
        ".JPG",
        ".JPEG",
        ".gif",
        ".GIF",
      ];
      let found = suffix_array.find((v) => att.url.endsWith(v));
      if (!found) continue;
      return att.url;
    }
    return null;
  }
}
