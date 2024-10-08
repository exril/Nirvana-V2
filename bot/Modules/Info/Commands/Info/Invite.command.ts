import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import { Emoji } from '../../../../utils/Emotes.utils.js';

export default class Invite extends Command {
    constructor(client: Bot) {
        super(client, {
            name: 'invite',
            description: {
                content: 'Invite link of the bot.',
                examples: ['invite'],
                usage: 'invite',
            },
            category: 'Info',
            aliases: ['inv'],
            cooldown: 3,
            args: false,
            isPremium: false,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        })
    }
    public async run(client: Bot, ctx: Context): Promise<any> {
        const compos = [
            {
                type: 2,
                style: 5,
                label: "Invite",
                url: "https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot",
                emoji: Emoji.invite
            },
            {
                type: 2,
                style: 5,
                label: "Support",
                url: "https://discord.gg/9bWCU6VPEM",
                emoji: Emoji.support
            }
        ];
        ctx.sendMessage({
            content: "Here You Go !",
            components: [
                {
                    type: 1,
                    components: compos,
                }
            ]
        })
    }
}