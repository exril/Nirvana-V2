import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import {
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ComponentType
} from "discord.js";
import { Emoji } from '../../../../utils/Emotes.utils.js';
const verificationLevels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High",
};
const verificationLevelsStage = {
    0: "Unrestricted",
    1: "Must Have Verified Email On Account",
    2: "Must Be Registered On Discord For Longer Than 5 Minutes",
    3: "Must Be A Member Of The Guild For Longer Than 10 Minutes",
    4: "Must Have A Verified Phone Number",
};
const explicitContentFilter = {
    0: "Off",
    1: "Member With Role",
    2: "All Members",
};
const defaultMessageNotifications = {
    0: "All Messages",
    1: "Only @mentions",
};
const mfaLevels = {
    0: "No",
    1: "Yes",
};


export default class ServerInfo extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "serverinfo",
            description: {
                content: "Returns info of a server",
                examples: ["serverinfo"],
                usage: "si",
            },
            category: "Utility",
            aliases: ["si"],
            cooldown: 3,
            args: false,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
        ctx.guild.members.fetch();
        const embed = this.client
            .embed()
            .setAuthor({ name: `${ctx.guild.name}'s Information`, iconURL: ctx.guild.iconURL() })
            .setTitle(`Server Information`)
            .setColor(this.client.color.main)
            .setThumbnail(ctx.guild.iconURL())
            .setDescription(` ${ctx.guild.description ? ctx.guild.description : 'No Description'}`)
            .setTimestamp()
            .addFields([
                {
                    name: 'ID',
                    value: `${ctx.guild.id}`
                },
                {
                    name: `Created At`,
                    value: `<t:${Math.floor(ctx.guild.createdTimestamp / 1000.0)}:f> | <t:${Math.floor(ctx.guild.createdTimestamp / 1000.0)}:R>`
                },
                {
                    name: `Owner`,
                    value: `<@${(await ctx.guild.fetchOwner()).user.id}>`
                }
            ])
        const karma2 = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("server")
                    .setPlaceholder('Server Information Panel')
                    .addOptions(
                        {
                            label: "General",
                            emoji: `<:icons_info:1180059459750469663>`,
                            value: "gen"
                        },
                        {
                            label: 'Members',
                            emoji: `<:icons_members:1180059657566433342>`,
                            value: 'mem'
                        },
                        {
                            label: 'Channels',
                            emoji: `<:icons_channel:1180059479279153235>`,
                            value: 'chnl'
                        },
                        {
                            label: 'Boosts',
                            emoji: `<:icons_boost:1119200708017786922>`,
                            value: 'bst'
                        },
                        {
                            label: 'Features',
                            emoji: `<:icons_shine2:1116786120009723984>`,
                            value: 'fea'
                        },
                        {
                            label: 'Moderation',
                            emoji: `<:moderation:1180059660502437909>`,
                            value: 'mod'
                        }
                    ))
        const m = await ctx.sendMessage({
            embeds: [embed],
            components: [karma2]
        });

        const collector = m.createMessageComponentCollector({
            filter: (i) => i.user.id === ctx.author.id,
            componentType: ComponentType.StringSelect,
            time: 1000 * 60 * 60
        });

        collector.on("collect", async (i) => {
            if (i.customId === "server")
                switch (i.values[0]) {
                    case "gen":
                        i.update({
                            embeds: [embed],
                            components: [karma2]
                        });
                        break;

                    case "mem":
                        const embed1 = this.client
                            .embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL({}) })
                            .setThumbnail(ctx.guild.iconURL({ size: 2048 }))
                            .setColor(this.client.color.main)
                            .addFields([
                                {
                                    name: "Members",
                                    value: `Total Members: ${ctx.guild.memberCount
                                        }\nHumans: ${ctx.guild.members.cache.filter(
                                            (m) => m.user.bot == false
                                        ).size
                                        }\nBots: ${ctx.guild.members.cache.filter(
                                            (m) => m.user.bot == true
                                        ).size
                                        }`,
                                },
                            ]);
                        i.update({
                            embeds: [embed1],
                        });
                        break;

                    case "chnl":
                        const embed2 = this.client
                            .embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL() })
                            .setColor(this.client.color.main)
                            .setThumbnail(ctx.guild.iconURL({ size: 2048 }))
                            .setTimestamp()
                            .addFields([
                                {
                                    name: "Text Channels",
                                    value: `Total Channels: ${ctx.guild.channels.cache.size
                                        }\nText Channels: ${ctx.guild.channels.cache.filter(
                                            (c) => c.type === 0
                                        ).size
                                        }\nVoice Channels: ${ctx.guild.channels.cache.filter(
                                            (c) => c.type === 2
                                        ).size
                                        }\nCategories: ${ctx.guild.channels.cache.filter(
                                            (c) => c.type === 4
                                        ).size
                                        }`,
                                },
                                {
                                    name: "AFK Channel",
                                    value: ctx.guild.afkChannel ? `<#${ctx.guild.afkChannel.id}>` : "None",
                                },
                                {
                                    name: "Hidden Channels",
                                    value: `Total Channels: ${ctx.guild.channels.cache.filter(
                                        (c) =>
                                            !c
                                                .permissionsFor(ctx.guild.id)
                                                .has("ViewChannel")
                                    ).size
                                        }\nText Channels: ${ctx.guild.channels.cache.filter(
                                            (c) =>
                                                c.type === 0 &&
                                                !c
                                                    .permissionsFor(ctx.guild.id)
                                                    .has("ViewChannel")
                                        ).size
                                        }\nVoice Channels: ${ctx.guild.channels.cache.filter(
                                            (c) =>
                                                c.type === 2 &&
                                                !c
                                                    .permissionsFor(ctx.guild.id)
                                                    .has("ViewChannel")
                                        ).size
                                        }\nCategories: ${ctx.guild.channels.cache.filter(
                                            (c) =>
                                                c.type === 4 &&
                                                !c
                                                    .permissionsFor(ctx.guild.id)
                                                    .has("ViewChannel")
                                        ).size
                                        }`,
                                },
                            ])
                        i.update({
                            embeds: [embed2],
                        });
                        break;

                    case "bst":
                        const embed3 = this.client
                            .embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL(), })
                            .setColor(this.client.color.main)
                            .setThumbnail(ctx.guild.iconURL({ size: 2048 }))
                            .addFields([
                                {
                                    name: "Boosts",
                                    value:
                                        ctx.guild.premiumSubscriptionCount +
                                        " Boosts",
                                },
                                {
                                    name: "Level",
                                    value: `Level ${ctx.guild.premiumTier}`,
                                },
                                {
                                    name: "Boosters",
                                    value:
                                        ctx.guild.members.cache
                                            .filter((m) => m.premiumSince != null)
                                            .map((m) => `<@${m.user.id}>`)
                                            .join(", ") || "None",
                                },
                                {
                                    name: "Latest Boosters",
                                    value:
                                        ctx.guild.members.cache
                                            .filter((m) => m.premiumSince != null)
                                            .sort(
                                                (a, b) =>
                                                    b.premiumSinceTimestamp -
                                                    a.premiumSinceTimestamp
                                            )
                                            .map((m) => `<@${m.user.id}>`)
                                            .slice(0, 5)
                                            .join(", ") || "None",
                                },
                            ]);
                        i.update({
                            embeds: [embed3],
                        });
                        return;

                    case "fea":
                        let guildFeatures =
                            ctx.guild.features
                                .join("\n")
                                .replace(
                                    /THREADS_ENABLED/g,
                                    `${Emoji.tick} Threads Enabled`
                                )
                                .replace(
                                    /MEMBER_PROFILES/g,
                                    `${Emoji.tick} Members Profile`
                                )
                                .replace(
                                    /ENABLED_DISCOVERABLE_BEFORE/g,
                                    `${Emoji.tick} Discoverable Before`
                                )
                                .replace(
                                    /NEW_THREAD_PERMISSIONS/g,
                                    `${Emoji.tick} New Thread Permission`
                                )
                                .replace(
                                    /CHANNEL_BANNER/g,
                                    `${Emoji.tick} Channel Banner`
                                )
                                .replace(
                                    /ANIMATED_BANNER/g,
                                    `${Emoji.tick} Animated Banner`
                                )
                                .replace(
                                    /ANIMATED_ICON/g,
                                    `${Emoji.tick} Animated Icon`
                                )
                                .replace(
                                    /BANNER/g,
                                    `${Emoji.tick} Banner`
                                )
                                .replace(
                                    /COMMERCE/g,
                                    `${Emoji.tick} Commerce`
                                )
                                .replace(
                                    /COMMUNITY/g,
                                    `${Emoji.tick} Community`
                                )
                                .replace(
                                    /DISCOVERABLE/g,
                                    `${Emoji.tick} Discoverable`
                                )
                                .replace(
                                    /FEATURABLE/g,
                                    `${Emoji.tick} Featurable`
                                )
                                .replace(
                                    /INVITE_SPLASH/g,
                                    `${Emoji.tick} Invite Splash`
                                )
                                .replace(
                                    /MEMBER_VERIFICATION_GATE_ENABLED/g,
                                    `${Emoji.tick} Member Verifaction Gate`
                                )
                                .replace(
                                    /NEWS/g,
                                    `${Emoji.tick} News`
                                )
                                .replace(
                                    /PARTNERED/g,
                                    `${Emoji.tick} Partnered`
                                )
                                .replace(
                                    /PREVIEW_ENABLED/g,
                                    `${Emoji.tick} Preview`
                                )
                                .replace(
                                    /VANITY_URL/g,
                                    `${Emoji.tick} Vanity URL`
                                )
                                .replace(
                                    /VERIFIED/g,
                                    `${Emoji.tick} Verified`
                                )
                                .replace(
                                    /VIP_REGIONS/g,
                                    `${Emoji.tick} VIP Region`
                                )
                                .replace(
                                    /WELCOME_SCREEN_ENABLED/g,
                                    `${Emoji.tick} Welcome Screen`
                                )
                                .replace(
                                    /TICKETED_EVENTS_ENABLED/g,
                                    `${Emoji.tick} Tickets Enabled`
                                )
                                .replace(
                                    /MONETIZATION_ENABLED/g,
                                    `${Emoji.tick} Monetization`
                                )
                                .replace(
                                    /MORE_STICKERS/g,
                                    `${Emoji.tick} More Stickets`
                                )
                                .replace(
                                    /THREE_DAY_THREAD_ARCHIVE/g,
                                    `${Emoji.tick} Three Days Thread Archive`
                                )
                                .replace(
                                    /SEVEN_DAY_THREAD_ARCHIVE/g,
                                    `${Emoji.tick} Seven Days Thread Archive`
                                )
                                .replace(
                                    /PRIVATE_THREADS/g,
                                    `${Emoji.tick} Private Threads`
                                )
                                .replace(
                                    /ROLE_ICONS/g,
                                    `${Emoji.tick} Role Icon`
                                )
                                .replace(
                                    /HAS_DIRECTORY_ENTRY /g,
                                    `${Emoji.tick} Has Directory Entry`
                                )
                                .replace(
                                    /HUB/g,
                                    `${Emoji.tick} Hub`
                                )
                                .replace(
                                    /MONETIZATION_ENABLED/g,
                                    `${Emoji.tick} Monetization`
                                )
                                .replace(
                                    /MORE_STICKERS/g,
                                    `${Emoji.tick} More Stickets`
                                )
                                .replace(
                                    /AUTO_MODERATION/g,
                                    `${Emoji.tick} Auto Moderation`
                                )
                                .replace(
                                    /TEXT_IN_VOICE_ENABLED/g,
                                    `${Emoji.tick} Text In Voice`
                                )
                                .replace(
                                    /DEVELOPER_SUPPORT_SERVER/g,
                                    `${Emoji.tick} Developer Support Server`
                                )
                                .replace(
                                    /PREMIUM_SUBSCRIPTION_COUNT/g,
                                    `${Emoji.tick} Premium Subscription Count`
                                )
                                .replace(
                                    /APPLICATION_COMMAND_PERMISSIONS_V2/g,
                                    `${Emoji.tick} Application Command Permissions`
                                )
                                .substr(0, 1020) + "...";
                        const embed4 = this.client
                            .embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL(), })
                            .setColor(this.client.color.main)
                            .setThumbnail(ctx.guild.iconURL({ size: 2048 }))
                            .setTimestamp()
                            .addFields([
                                {
                                    name: "Features",
                                    value: guildFeatures || "None",
                                },
                            ]);
                        i.update({
                            embeds: [embed4],
                        });
                        break;

                    case "mod":
                        const embed5 = this.client
                            .embed()
                            .setAuthor({ name: ctx.guild.name, iconURL: ctx.guild.iconURL(), })
                            .setColor(this.client.color.main)
                            .setThumbnail(ctx.guild.iconURL({ size: 2048 }))
                            .setTimestamp()
                            .addFields([
                                {
                                    name: `Verifaction Level: ${verificationLevels[
                                        ctx.guild.verificationLevel
                                    ] || "None"
                                        }`,
                                    value:
                                        verificationLevelsStage[
                                        ctx.guild.verificationLevel
                                        ] || "None",
                                },
                                {
                                    name: "Explicit Content Filter",
                                    value:
                                        explicitContentFilter[
                                        ctx.guild.explicitContentFilter
                                        ] || "None",
                                },
                                {
                                    name: "Default Notifications",
                                    value:
                                        defaultMessageNotifications[
                                        ctx.guild.defaultMessageNotifications
                                        ] || "None",
                                },
                                {
                                    name: "Moderators Require 2FA?",
                                    value: mfaLevels[ctx.guild.mfaLevel] || "No",
                                },
                            ]);
                        i.update({
                            embeds: [embed5],
                        });
                        break;
                }
        });

    }
}
