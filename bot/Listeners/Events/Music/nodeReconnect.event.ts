import { WebhookClient } from "discord.js";
import { Bot } from "../../../Clients/Bot.client.js";
import Event from "../../../Structures/Event.structure.js";

export default class NodeReconnect extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "nodeReconnect",
    });
  }

  public async run(node: string): Promise<void> {
    const message = `Node ${node} reconnected`;
    //this.client.logger.warn("Node", message);
    const hook = new WebhookClient({
      url: this.client.config.webhooks.nodelog,
    });
    await hook.send({
      embeds: [
        this.client
          .embed()
          .setColor(this.client.color.main)
          .setFields(
            {
              name: `Node`,
              value: `${node}`,
              inline: true,
            },
            {
              name: `Status`,
              value: `Reconnected!`,
              inline: true,
            },
            {
              name: `Warn`,
              value: `${message}`,
              inline: false,
            }
          )
          .setTimestamp(),
      ],
    });
  }
}
