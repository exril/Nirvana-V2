import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import { Emoji } from '../../../../utils/Emotes.utils.js';
import {
    ApplicationCommandOptionType,
    FetchMemberOptions,
    FetchMembersOptions,
    GuildMember,
    PermissionsBitField,
    UserResolvable
} from 'discord.js';
let flagg = {
    '': 'None',
    'Staff': Emoji.staff,
    'Partner': Emoji.partner,
    'BugHunterLevel1': Emoji.BugHLevel1,
    'HypeSquad': Emoji.hypesquad,
    'BugHunterLevel2': Emoji.BugHLevel2,
    'HypeSquadOnlineHouse3': Emoji.HyperSquadBalance,
    'HypeSquadOnlineHouse2': Emoji.HyperSquadBrilliance,
    'HypeSquadOnlineHouse1': Emoji.HyperSquadBravery,
    'PremiumEarlySupporter': Emoji.Earlysup,
    'VerifiedBot': Emoji.Verifiedbot,
    'VerifiedDeveloper': Emoji.VerifiedDev,
    'CertifiedModerator': Emoji.CertifiedMod,
    'ActiveDeveloper': Emoji.ActiveDev,
}

export default class UserInfo extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "userinfo",
            description: {
                content: "Returns info of a user",
                examples: ["userinfo <user>"],
                usage: "ui <user>",
            },
            category: "Utility",
            aliases: ["ui"],
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
        let member = null;
        try {
            member = await ctx.guild.members.fetch(user);
        } catch (err) {
            member = await client.users.fetch(user);
        }
        if (member === null)
            return ctx.sendMessage("User not found.");

        let permissionsArray = [];
        let acknowledgements = "Member";
        const badges = member.user
            ? member.user.flags.toArray()
            : member.flags.toArray();

        const embed = this.client
            .embed()
            .setFooter({ text: ctx.author.tag, iconURL: ctx.author.displayAvatarURL() })
            .setTimestamp();
        if (member instanceof GuildMember) {
            if (member.permissions.has(PermissionsBitField.Flags.Administrator))
                permissionsArray.push("Administrator");
            if (member.permissions.has(PermissionsBitField.Flags.BanMembers))
                permissionsArray.push("Ban Members");
            if (member.permissions.has(PermissionsBitField.Flags.ChangeNickname))
                permissionsArray.push("Change Nickname");
            if (member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite))
                permissionsArray.push("Create Instant Invite");
            if (member.permissions.has(PermissionsBitField.Flags.DeafenMembers))
                permissionsArray.push("Deafen Members");
            if (member.permissions.has(PermissionsBitField.Flags.KickMembers))
                permissionsArray.push("Kick Members");
            if (member.permissions.has(PermissionsBitField.Flags.ManageChannels))
                permissionsArray.push("Manage Channels");
            if (member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers))
                permissionsArray.push("Manage Emojis");
            if (member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                permissionsArray.push("Manage Guild");
            if (member.permissions.has(PermissionsBitField.Flags.ManageMessages))
                permissionsArray.push("Manage Messages");
            if (member.permissions.has(PermissionsBitField.Flags.ManageNicknames))
                permissionsArray.push("Manage Nicknames");
            if (member.permissions.has(PermissionsBitField.Flags.ManageRoles))
                permissionsArray.push("Manage Roles");
            if (member.permissions.has(PermissionsBitField.Flags.ManageWebhooks))
                permissionsArray.push("Manage Webhooks");
            if (member.permissions.has(PermissionsBitField.Flags.MentionEveryone))
                permissionsArray.push("Mention Everyone");
            if (member.permissions.has(PermissionsBitField.Flags.MoveMembers))
                permissionsArray.push("Move Members");
            if (member.permissions.has(PermissionsBitField.Flags.MuteMembers))
                permissionsArray.push("Mute Members");
            if (member.permissions.has(PermissionsBitField.Flags.PrioritySpeaker))
                permissionsArray.push("Priority Speaker");
            if (member.permissions.has(PermissionsBitField.Flags.UseVAD))
                permissionsArray.push("Use VAD");
            if (member.permissions.has(PermissionsBitField.Flags.ViewAuditLog))
                permissionsArray.push("View Audit Logs");
            if (member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                acknowledgements = "Moderator";
            if (member.permissions.has(PermissionsBitField.Flags.Administrator))
                acknowledgements = "Administrator";
            if (member.id == ctx.guild.ownerId)
                acknowledgements = "Server Owner";
            embed.setAuthor({ name: `${member.user.username}#${member.user.discriminator}`, iconURL: member.user.displayAvatarURL() });
            embed.setThumbnail(member.user.displayAvatarURL());
            embed.setImage((await member.user.fetch()).bannerURL({ size: 2048 }));
            embed.setColor(this.client.color.main);
            embed.addFields([
                {
                    name: "__**Informations**__",
                    value: `**Username:** ${member.user.tag}
**ID:** ${member.id}
**Nickname:** ${member.nickname ? member.nickname : "None"}
**Bot:** ${member.user.bot
                            ? "Yes " + Emoji.tick
                            : "No " + Emoji.cross
                        }
**Badges:** ${badges.length != 0
                            ? badges.map((c: string | number) => flagg[c]).join(", ")
                            : "None"
                        }
**Joined At:** <t:${Math.floor(member.joinedTimestamp / 1000.0)}:R>
**Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000.0)}:R>`,
                },
                {
                    name: "__**Extra**__",
                    value: `**Highest Role:** ${member.roles.highest}
**Boosting Since:** ${member.premiumSince
                            ? `<t:${Math.floor(
                                member.premiumSinceTimestamp / 1000.0
                            )}:R>`
                            : "None"
                        }
**Voice Channel:** ${member.voice.channel ? member.voice.channel : "None"}`,
                },
                {
                    name: "__**Key Permissions**__",
                    value:
                        permissionsArray.length != 0
                            ? permissionsArray.join(", ")
                            : "No Key Permissions Available",
                },
                {
                    name: "__**Acknowledgements**__",
                    value: `${acknowledgements ? acknowledgements : "None"}`,
                },
            ]);

            return ctx.sendMessage({
                embeds: [embed],
            });
        }
        embed.setAuthor({ name: `${member.tag}#${member.discriminator}`, iconURL: member.displayAvatarURL() });
        embed.setThumbnail(member.displayAvatarURL());
        embed.setColor(this.client.color.main);
        embed.addFields([
            {
                name: "__Informations__",
                value: `**Username:** ${member.tag}
**ID:** ${member.id}
**Bot:** ${member.bot
                        ? "Yes " + Emoji.tick
                        : "No " + Emoji.cross
                    }
**Badges:** ${badges.length != 0
                        ? badges.map((c: string | number) => flagg[c]).join(", ")
                        : "None"
                    }
**Created At:** <t:${Math.floor(member.createdTimestamp / 1000.0)}:R>`,
            },
        ]);
        embed.setImage((await member.fetch()).bannerURL({ size: 2048 }));

        ctx.sendMessage({
            embeds: [embed]
        });
    }
}
