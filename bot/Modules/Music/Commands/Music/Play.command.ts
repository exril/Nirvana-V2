import { LoadType } from "shoukaku";
import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";
import { AutocompleteInteraction } from "discord.js";

export default class Play extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "play",
      description: {
        content: "Plays a song from YouTube or Spotify",
        examples: [
          "play https://open.spotify.com/track/6WrI0LAC5M1Rw2MnX2ZvEg",
        ],
        usage: "play <song>",
      },
      category: "Music",
      aliases: ["p"],
      cooldown: 3,
      args: true,
      player: {
        voice: true,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ViewChannel",
          "EmbedLinks",
          "Connect",
          "Speak",
        ],
        user: [],
      },
      slashCommand: true,
      options: [
        {
          name: "song",
          description: "The song you want to play",
          type: 3,
          required: true,
          autocomplete: true,
        },
      ],
    });
  }
  public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
    const query = args.join(" ");
    // await ctx.sendDeferMessage("Loading...");
    let player = client.queue.get(ctx.guild.id);
    const vc = ctx.member as any;
    if (!player)
      player = await client.queue.create(
        ctx.guild,
        vc.voice.channel,
        ctx.channel
      );

    const res = await this.client.queue.search(query);
    const embed = this.client.embed();

    switch (res.loadType) {
      case LoadType.ERROR:
        player.destroy();
        await ctx.sendMessage({
          content: `There was an error while searching!`,
        });
        break;
      case LoadType.EMPTY:
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.red)
              .setDescription(
                `**${ctx.author.username}**, No matches found for your search **${query}**`
              ),
          ],
        });
        break;
      case LoadType.TRACK: {
        const track = player.buildTrack(res.data, ctx.author);
        player.queue.push(track);
        await player.isPlaying();
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setAuthor({
                name: `Position - #${player.queue.length + 1}`,
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                `Added [${res.data.info.title}](${
                  res.data.info.uri
                }) (\`${this.client.botfunctions.formatTime(
                  track.info.length
                )}\`) To Music Queue`
              ),
          ],
        });
        break;
      }
      case LoadType.PLAYLIST: {
        console.log(res?.data.info);
        for (const track of res.data.tracks) {
          const pl = player.buildTrack(track, ctx.author);
          player.queue.push(pl);
        }
        await player.isPlaying();
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setAuthor({
                name: `Queue Size - ${player.queue.length}`,
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                `Loaded \`[${res.data.tracks.length}]\` Tracks From: [${
                  res.data.info.name
                }](${query}) - \`[${this.client.botfunctions.formatTime(
                  res.data.tracks.length
                )}]\``
              ),
          ],
        });
        break;
      }
      case LoadType.SEARCH: {
        const track1 = player.buildTrack(res.data[0], ctx.author);
        player.queue.push(track1);
        await player.isPlaying();
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setAuthor({
                name: `Position - #${player.queue.length + 1}`,
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                `Added [${res.data[0].info.title}](${
                  res.data[0].info.uri
                }) (\`${this.client.botfunctions.formatTime(
                  res.data[0].info.length
                )}\`) To Music Queue`
              ),
          ],
        });
        break;
      }
    }
  }
  public async autocomplete(
    interaction: AutocompleteInteraction
  ): Promise<void> {
    const focusedValue = interaction.options.getFocused();
    const res = await this.client.queue.search(focusedValue);
    const songs = [];

    if (res?.loadType) {
      if (res.loadType === LoadType.SEARCH && res.data.length) {
        res.data.slice(0, 10).forEach((track) => {
          const name = `${track.info.title} by ${track.info.author}`;
          songs.push({
            name: name.length > 100 ? `${name.substring(0, 97)}...` : name,
            value: track.info.uri,
          });
        });
      } else if (res.loadType === LoadType.PLAYLIST && res.data.tracks.length) {
        res.data.tracks.slice(0, 10).forEach((track) => {
          const name = `${track.info.title} by ${track.info.author}`;
          songs.push({
            name: name.length > 100 ? `${name.substring(0, 97)}...` : name,
            value: track.info.uri,
          });
        });
      }
    }
    return await interaction.respond(songs).catch(console.error);
  }
}
