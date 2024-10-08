import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Bot } from "../Clients/Bot.client";
import Module from "../Structures/Module.structure";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ModuleHandler {
  public client: Bot;
  constructor(client: Bot) {
    this.client = client;

    this.client.logger.debug("ModuleHandler", "Loading Modules");
  }
  public loadModules(): void {
    const Modules = fs.readdirSync(path.join(__dirname, "../Modules"));
    Modules.forEach(async (module) => {
      try {
        const file = (await import(`../Modules/${module}/index.js`)).default;
        const mod: Module = new file(this.client, module)
        await mod.load();
      } catch (e) {
        // this.client.logger.error(module, e);
        console.log(e)
      }
    });
  }
}
