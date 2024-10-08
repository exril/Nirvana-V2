import { REST } from "discord.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";
import { Emoji } from "../../../../utils/Emotes.utils.js";

export default class Stop extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "stop",
      description: {
        content: "Stops the music and clears the queue",
        examples: ["stop"],
        usage: "stop",
      },
      category: "Music",
      aliases: ["stopmusic"],
      cooldown: 3,
      args: false,
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
    const guild = await this.client.guilds.fetch(player.guildId);
    const vcId = guild.members.me.voice.channelId;
    const rest = new REST({
      version: "10",
    }).setToken(this.client.config.token);
    player.queue = [];
    player.destroy();
    await rest.put(`/channels/${vcId}/voice-status`, {
      body: {
        status: ``,
      },
    });
    let embed = this.client
      .embed()
      .setColor(this.client.color.main)
      .setDescription(
        `**${ctx.author.username}**, I've stopped the music & cleared the queue!`
      );
    const compos = [
      {
        type: 2,
        style: 5,
        label: "Enjoying Nirvana ? Vote Now !",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: Emoji.vote,
      },
    ];
    return await ctx.sendMessage({
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
