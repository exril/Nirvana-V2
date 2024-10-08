import { Bot } from "../../../Clients/Bot.client.js";
import Event from "../../../Structures/Event.structure.js";

export default class NodeRaw extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "nodeRaw",
    });
  }

  public async run(message): Promise<void> {
    // this.client.logger.debug("Node Raw",message)
  }
}