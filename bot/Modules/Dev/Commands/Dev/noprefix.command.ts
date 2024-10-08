import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';

export default class Noprefix extends Command {
    constructor(client: Bot) {
        super(client, {
            name: 'noprefix',
            description: {
                content: 'add/remove noprefix to a user.',
                examples: ['add/remove userId'],
                usage: '<add/remove> <userId>',
            },
            category: 'Dev',
            aliases: ['npr'],
            cooldown: 3,
            args: true,
            isPremium: false,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: false,
            options: [],
        })
    }
    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        let user;
        let action = args[0].toLowerCase();
        let id = args[1].toLowerCase();
        if (!args[0])
            return ctx.sendMessage("Please enter valid args - add/remove");
        if (!args[1]) {
            return ctx.sendMessage("Please enter valid userId")
        } else {
            if (ctx.message.mentions.users.first()) {
                user = ctx.message.mentions.users.first() || args[1];
            }
            else if (args[1]) {
                user = await client.users.fetch(args[1].toLowerCase(), { force: true }).catch(err => { return undefined; })
            } else {
                user = ctx.author;
            }
        }
        if (!user)
            return ctx.sendMessage("Please enter a valid userId");
        switch (action) {
            case "add":
                if (await this.client.db.hasNoPrefix(user.id) === true) {
                    ctx.sendMessage({
                        content: `User provided already has my noprefix access!`
                    });
                    return;
                }
                await this.client.db.addNoPrefix(user.id);
                let embed = this.client
                    .embed()
                    .setDescription(`Successfully added ${user.username} [\`${user.id}\`] to my no prefix.`)
                    .setFooter({ text: `@${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
                    .setTimestamp();
                await ctx.sendMessage({
                    embeds: [embed]
                });
                break;
            case "remove":
                if (await this.client.db.hasNoPrefix(user.id) === false) {
                    ctx.sendMessage({
                        content: `User provided doesn\'t has my noprefix access!`
                    });
                    return;
                }
                await this.client.db.delNoPrefix(user.id);
                let embed2 = this.client
                    .embed()
                    .setDescription(`Successfully removed ${user.username} [\`${user.id}\`] from my no prefix.`)
                    .setFooter({ text: `@${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })
                    .setTimestamp();
                await ctx.sendMessage({
                    embeds: [embed2]
                });
                break;
            default:
                ctx.sendMessage("Provide me a valid action \`add/remove\`.")
        }
    }
}