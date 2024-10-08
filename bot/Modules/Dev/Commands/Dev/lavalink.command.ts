import { Command } from "../../../../Structures/Command.structure.js";
import { Bot } from "../../../../Clients/Bot.client.js";
import Context from "../../../../Structures/Context.structure.js";

export default class Node extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "node",
      description: {
        content: "lavalink stats",
        examples: ["node"],
        usage: "node",
      },
      category: "Dev",
      aliases: ["lavalink"],
      cooldown: 3,
      args: false,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: true,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      slashCommand: false,
      options: [],
    });
  }

  public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
    const nodes = client.shoukaku.nodes;
    const nodesPerPage = 2;

    const nodeArray = Array.from(nodes.values());
    const chunks = client.botfunctions.chunk(nodeArray, nodesPerPage);

    if (chunks.length === 0) chunks.push(nodeArray);

    const pages = chunks.map((chunk, index) => {
      const embed = this.client
        .embed()
        .setTitle(`Lavalink Stats`)
        .setColor(this.client.color.main)
        .setThumbnail(this.client.user.avatarURL())
        .setTimestamp();

      chunk.forEach((node) => {
        const statusEmoji = node.stats ? "🟩" : "🟥";
        const stats = node.stats || {
          players: 0,
          playingPlayers: 0,
          uptime: 0,
          cpu: { cores: 0, systemLoad: 0, lavalinkLoad: 0 },
          memory: { used: 0, reservable: 0 },
        };
        embed.addFields({
          name: `${node.name} (${statusEmoji})`,
          value: `\`\`\`yaml\n
Players: ${stats.players},
PlayingPlayers: ${stats.playingPlayers},
Uptime: ${client.botfunctions.formatTime(stats.uptime)},
Cores: ${stats.cpu.cores},
Used: ${this.client.botfunctions.formatBytes(stats.memory.used)},
Reservable: ${client.botfunctions.formatBytes(stats.memory.reservable)},
SystemLoad: ${(stats.cpu.systemLoad * 100).toFixed(2)},
Lavalink Load: ${(stats.cpu.lavalinkLoad * 100).toFixed(2)},
          \n\`\`\``,
        });
      });
      embed.setFooter({
        text: `Viewing Page ${index + 1}/${chunks.length}`,
        iconURL: client.user.displayAvatarURL(),
      });
      return embed;
    });
    return await client.botfunctions.paginate(client, ctx, pages);
  }
}
