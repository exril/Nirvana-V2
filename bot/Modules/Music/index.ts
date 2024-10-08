import Module from "../../Structures/Module.structure.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { ApplicationCommandType, PermissionsBitField } from "discord.js";
import { Bot } from "../../Clients/Bot.client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class MusicModule extends Module {
  constructor(client: Bot, file) {
    super(client, file, {
      name: "MusicModule",
      required: true,
    });
    this.client = client;
  }

  /**
   * Function for loading the module
   */
  public async load(): Promise<any> {
    this.client.logger.log(this.name, "Loading Module");
    try {
      const commandsPath = fs.readdirSync(path.join(__dirname, "./Commands"));
      commandsPath.forEach((dir) => {
        const files = fs
          .readdirSync(path.join(__dirname, "./Commands", dir))
          .filter((file) => file.endsWith(".js"));

        files.forEach(async (file) => {
          const cmd = (await import(`./Commands/${dir}/${file}`)).default;
          const command = new cmd(this.client)
          this.client.commands.set(command.name, command);
          if (command.aliases.length !== 0) {
            command.aliases.forEach((alias: string) => {
              this.client.aliases.set(alias, command.name);
            });
          }
          if (command.slashCommand) {
            const data = {
              name: command.name,
              description: command.description.content,
              type: ApplicationCommandType.ChatInput,
              options: command.options ? command.options : null,
              name_localizations: command.nameLocalizations
                ? command.nameLocalizations
                : null,
              description_localizations: command.descriptionLocalizations
                ? command.descriptionLocalizations
                : null,
              default_member_permissions:
                command.permissions.user.length > 0
                  ? command.permissions.user
                  : null,
            };
            if (command.permissions.user.length > 0) {
              const permissionValue = PermissionsBitField.resolve(
                command.permissions.user
              );
              if (typeof permissionValue === "bigint") {
                data.default_member_permissions = permissionValue.toString();
              } else {
                data.default_member_permissions = permissionValue;
              }
            }
            const json = JSON.stringify(data);
            this.client.body.push(JSON.parse(json));
          }
          this.client.logger.log(
            this.name,
            `Command ${command.name} loaded in the module.`
          );
        });
      });

      this.client.logger.log(this.name, "Module loadded succesfully");
    } catch (e) {
      this.client.logger.error(this.name, e);
    }
  }
  public async unload(): Promise<any> {
    this.client.logger.log(this.name,"Unload Under Development.")
  }
}
