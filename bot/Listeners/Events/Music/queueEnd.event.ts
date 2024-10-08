import type { Player } from "shoukaku";
import { Bot } from "../../../Clients/Bot.client";
import Dispatcher, { Song } from "../../../Modules/Music/Dispatcher.music";
import Event from "../../../Structures/Event.structure.js";

export default class QueueEnd extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "queueEnd",
    });
  }

  public async run(
    _player: Player,
    track: Song,
    dispatcher: Dispatcher
  ): Promise<void> {
    const guild = await this.client.guilds
      .fetch(dispatcher.guildId)
      .catch(() => {});
    if (!guild) return;
    switch (dispatcher.loop) {
      case "repeat":
        dispatcher.queue.unshift(track);
        break;
      case "queue":
        dispatcher.queue.push(track);
        break;
      case "off":
        dispatcher.previous = dispatcher.current;
        dispatcher.current = null;
        break;
    }

    if (dispatcher.autoplay) {
      await dispatcher.Autoplay(track);
    } else {
      dispatcher.autoplay = false;
    }

    const is247 = await this.client.db.get247(guild.id);
    if (!is247) {
      const textId = dispatcher.channelId;
      const channel = await guild.channels.fetch(textId).catch(() => {});
      dispatcher.destroy();
      //if (channel) console.log("hello left the channel");
      //   setTimeout(() => {
      //     _player.destroy();
      //   }, 10000);
    }
  }
}
