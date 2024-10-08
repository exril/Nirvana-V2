import { WebhookClient } from "discord.js";
import { Bot } from "../../../Clients/Bot.client.js";
import Event from "../../../Structures/Event.structure.js";

export default class NodeError extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "nodeError",
    });
  }

  public async run(node: string, error: string): Promise<void> {
    // this.client.logger.log("Node", `Node ${node} encountered an error`);
    // this.client.logger.error("Node", error);
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
              value: `Error!`,
              inline: true,
            },
            {
              name: `Error`,
              value: `${error}`,
              inline: false,
            }
          )
          .setTimestamp(),
      ],
    });
  }
}
