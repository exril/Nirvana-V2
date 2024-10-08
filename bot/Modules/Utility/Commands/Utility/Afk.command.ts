import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { JsonDB, Config } from 'node-json-db';

const db = new JsonDB(new Config("afkDatabase", true, false, '/'));
export { db };
export default class Afk extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "afk",
            description: {
                content: "Sets the Afk of a user!",
                examples: ["afk I'm Busy!"],
                usage: "afk <reason>",
            },
            category: "Utility",
            aliases: ["busy"],
            cooldown: 3,
            args: false,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "reason",
                    description: "The reason for your afk.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        interface Afks {
            Reason: string
            TimeStamp: number
        }

        const reason = args.join(` `) || `I'm Afk :/`;
        if (reason.includes("@everyone") || reason.includes("@here")) {
            await ctx.sendMessage({
                content: "Dumb! Are you trying to spam ?"
            });
        }
        const object = {
            Reason: reason,
            TimeStamp: Date.now()
        } as Afks;
        await db.push(`/${ctx.author.id}`, object, true);

        ctx.sendMessage({
            content: `**${ctx.author.tag}**, Your AFK is now set to: **${reason}**`,
            allowedMentions: { parse: ["users"] }
        })
    }
}
