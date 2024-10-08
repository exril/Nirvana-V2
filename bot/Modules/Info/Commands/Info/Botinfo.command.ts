import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";
import { version } from "discord.js";
import { Emoji } from "../../../../utils/Emotes.utils.js";

export default class Botinfo extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "botinfo",
      description: {
        content: "The info command of the bot.",
        examples: ["Botinfo"],
        usage: "botinfo",
      },
      category: "Info",
      aliases: ["bi", "info"],
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
    let karmauser = await client.users.fetch(`976105609936138311`);
    let shubuser = await client.users.fetch(`978930369392951366`);
    let arpanuser = await client.users.fetch(`928535547184574495`);
    const users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let discordjsversion = version;

    let embed = this.client
      .embed()
      .setAuthor({ name: `Nirvana Music, Feel The Beat Within` })
      .setDescription(
        `Hey **${
          ctx.author.tag
        }**, I'm Nirvana, a quality music bot which makes you feel the Music and it's Beats
      
  I was built using the popular [discord.js](https://discord.js.org/) library & now I'm currently running on **${
    process.platform
  } platform** with **Discord.js V${discordjsversion}**, providing you a latency of **${Math.round(
          ctx.client.ws.ping
        )}ms**
      
  I'm currently on **${
    client.guilds.cache.size
  } servers**, helping **${users} registered users** with **37 innovative commands**.  I am trying to empower every Discord user to discover, play and listen. 🎵 `
      )
      .setFields(
        {
          name: `Development Team`,
          value: `[@${karmauser.username}](https://discord.com/users/${karmauser.id}) — Founder/Main Dev.\n [@${shubuser.username}](https://discord.com/users/${shubuser.id}) —  Owner/Extra Dev/Web Dev/Team`,
        },
        {
          name: `Official Team`,
          value: `[@${arpanuser.username}](https://discord.com/users/${arpanuser.id}) — CEO/Management/Team`,
        },
        {
          name: `Sponsers Of Nirvana`,
          value: `[Hydra-Hosting.eu](https://hydra-hosting.eu/) — [Discord](https://discord.gg/DdRqBTTUMT)\n[@${shubuser.username}](https://discord.com/users/${shubuser.id}) — [Instagram](https://www.instagram.com/inever.kneel/)`,
        }
      )
      .setImage(this.client.config.url.infopage)
      .setColor(this.client.color.main)
      .setFooter({
        text: `Nirvana was developed by @${karmauser.username} —\nhttps://www.nirvanabot.pro`,
        iconURL: karmauser.displayAvatarURL(),
      });
    const compos = [
      {
        type: 2,
        style: 5,
        label: "Invite",
        url: "https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot",
        emoji: Emoji.invite,
      },
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
    return ctx.sendMessage({
      embeds: [embed],
      components: [
        {
          type: 1,
          components: compos,
        },
      ],
    });
  }
}
