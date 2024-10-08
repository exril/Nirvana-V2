import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import { ApplicationCommandOptionType } from 'discord.js';

export default class Avatar extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "avatar",
            description: {
                content: "Returns avatar of a user",
                examples: ["avatar <user>"],
                usage: "avatar <user>",
            },
            category: "Utility",
            aliases: ["av"],
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
        let user;
        if (ctx.isInteraction) {
            user = ctx.interaction.options.data[0].user;
        } else {
            if (ctx.message.mentions.users.first()) {
                user = ctx.message.mentions.users.first() || args[0];
            } else if (args[0]) {
                user = await client.users.fetch(args[0], { force: true }).catch(err => { return undefined; })
            } else {
                user = ctx.author;
            }
        }
        if (!user)
            return ctx.sendMessage(
                "Can't Fetch That User."
            );
        let customavatar = false;
        const member = await client.users.fetch(user);
        let globaluser = null;
        try {
            globaluser = await client.users.fetch(user).then(c => c.avatarURL({
                size: 2048,
            }));
        } catch (err) {
            console.log(err);
            globaluser = null;
        }
        if (globaluser === null) return ctx.sendMessage("User not found.");
        let guilduser = null;
        try {
            guilduser = await ctx.guild.members
                .fetch(user)
                .then((member) => member.avatarURL({ size: 2048 }));
        } catch (e) {
            guilduser = null;
        }
        if (globaluser !== guilduser) customavatar = true;
        if (guilduser === null) customavatar = false;
        let embed = this.client
            .embed()
            .setDescription(`Which avatar would you like to see?`)
            .setColor(this.client.color.main)
            .setFooter({ text: `Requested By ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() })

        ctx.sendMessage({
            embeds: [embed],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 2,
                            label: "Global Avatar",
                            custom_id: "global",
                        },
                        {
                            type: 2,
                            style: 2,
                            label: "Guild Avatar",
                            custom_id: "guild",
                            disabled: !customavatar,
                        },
                    ],
                },
            ],
        })
            .then(async (msg) => {
                const filter = (i) => i.user.id === ctx.author.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 25000,
                });
                collector.once("collect", async (int: any) => {
                    await int.deferUpdate();
                    if (int.customId === "global") {
                        embed.setImage(globaluser);
                        embed.setDescription(null);
                        embed.setAuthor({ name: `${member.tag}`, iconURL: `${member.displayAvatarURL()}` });
                        embed.setFooter({ text: `Requested By ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() });
                        const compos = [
                            {
                                type: 2,
                                style: 5,
                                label: "JPEG",
                                url: globaluser.replace("webp", "jpeg"),
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "PNG",
                                url: globaluser.replace("webp", "png"),
                            },
                        ];
                        if (globaluser.includes("a_")) {
                            compos.push({
                                type: 2,
                                style: 5,
                                label: "GIF",
                                url: globaluser.replace("webp", "gif"),
                            });
                        }
                        await ctx.editMessage({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: compos,
                                },
                            ],
                        });
                    }
                    if (int.customId === "guild") {
                        embed.setImage(guilduser);
                        embed.setDescription(null);
                        embed.setAuthor({ name: `${member.tag}`, iconURL: `${member.displayAvatarURL()}` });
                        embed.setFooter({ text: `Requested By ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL() });
                        const compos = [
                            {
                                type: 2,
                                style: 5,
                                label: "JPEG",
                                url: guilduser.replace("webp", "jpeg"),
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "PNG",
                                url: guilduser.replace("webp", "png"),
                            },
                        ];
                        if (guilduser.includes("a_")) {
                            compos.push({
                                type: 2,
                                style: 5,
                                label: "GIF",
                                url: guilduser.replace("webp", "gif"),
                            });
                        }
                        await ctx.editMessage({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: compos,
                                },
                            ],
                        });
                    }
                });
                collector.once("end", async (collected) => {
                    if (collected.size === 0) {
                        embed.setDescription(
                            `You didn't select an avatar in time!`
                        )
                        await ctx.editMessage({
                            embeds: [embed],
                            components: [],
                        })
                    }
                });
            });
    }
}