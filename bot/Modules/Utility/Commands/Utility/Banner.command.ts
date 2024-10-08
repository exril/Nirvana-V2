import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import { ApplicationCommandOptionType, APIUser } from 'discord.js';

export default class Banner extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "banner",
            description: {
                content: "Returns banner of a user",
                examples: ["banner <user>"],
                usage: "banner <user>",
            },
            category: "Utility",
            aliases: ["banneruser"],
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
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user whose avatar you want.",
                    required: false,
                },
            ],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        let member;
        if (ctx.isInteraction) {
            member = ctx.interaction.options.data[0].user;
        } else {
            if (ctx.message.mentions.users.first()) {
                member = ctx.message.mentions.users.first() || args[0];
            } else if (args[0]) {
                member = await client.users.fetch(args[0], { force: true }).catch(err => { return undefined; })
            } else {
                member = ctx.author;
            }
        }
        if (!member) {
            return ctx.sendMessage({
                content: "I couldn't find that user.",
            });
        }

        const response = await fetch(`https://discord.com/api/users/${member.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`,
            },
        })

        const { banner } = await response.json() as APIUser;

        if (!banner) {
            return ctx.sendMessage({
                content: "This user doesn't have a banner.",
            });
        } else {
            const extension = banner.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096';
            const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}`;

            let embed = this.client
                .embed()
                .setTitle(`${member.username}'s Banner`)
                .setImage(url)
                .setColor(this.client.color.main);
            const compos = [
                {
                    type: 2,
                    style: 5,
                    label: "JPEG",
                    url: `https://cdn.discordapp.com/banners/${member.id}/${banner}.png?size=4096`,
                },
                {
                    type: 2,
                    style: 5,
                    label: "PNG",
                    url: `https://cdn.discordapp.com/banners/${member.id}/${banner}.png?size=4096`,
                },
            ];
            if (banner.startsWith("a_")) {
                compos.push({
                    type: 2,
                    style: 5,
                    label: "GIF",
                    url: `https://cdn.discordapp.com/banners/${member.id}/${banner}.gif?size=4096`,
                });
            }

            return ctx.sendMessage({
                embeds: [embed],
                components: [
                    {
                        type: 1,
                        components: compos
                    }
                ],
            });
        }
    }
}