import {
  Collection,
  Message,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Bot } from "../../../Clients/Bot.client.js";
import { Context, Event } from "../../../Structures/index.js";
import { JsonDB, Config } from "node-json-db";
import { Emoji } from "../../../utils/Emotes.utils.js";
import { db } from "../../../Modules/Utility/Commands/Utility/Afk.command.js";
import { userInfo } from "os";
import UserSchema from "../../../Database/Schemas/User.schema.js";
import GuildSchema from "../../../Database/Schemas/Guild.schema.js";

export default class MessageCreate extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "messageCreate",
    });
  }

  public async run(_client: Bot, message: Message): Promise<any> {
    if (message.author.bot) return;
    let dm = message.author.dmChannel;
    if (typeof dm === "undefined") dm = await message.author.createDM();

    if (
      !message.inGuild() ||
      !message.channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionFlagsBits.ViewChannel)
    )
      return;

    const mentionedMember = message.mentions.members.first();
    if (mentionedMember) {
      const data = await db.exists(`/${mentionedMember.id}`);
      //console.log(data);
      if (data === true) {
        const timestamp = await db.getData(`/${mentionedMember.id}/TimeStamp`);
        const reason = await db.getData(`/${mentionedMember.id}/Reason`);

        message.reply({
          content: `${
            mentionedMember.user.username
          } is **AFK**\n${reason} - <t:${Math.floor(timestamp / 1000)}:R>`,
          allowedMentions: { parse: ["users"] },
        });
      }
    }
    const getData = await db.exists(`/${message.member.id}`);
    //console.log(getData);
    if (getData === true) {
      const timestamp = await db.getData(`/${message.member.id}/TimeStamp`);
      const reason = await db.getData(`/${message.member.id}/Reason`);
      db.delete(`/${message.member.id}`);
      message.reply({
        content: `Welcome back **${
          message.author.username
        }**! You went afk <t:${Math.floor(
          timestamp / 1000
        )}:R> with the reason - **${reason}**`,
        allowedMentions: { parse: ["users"] },
      });
    }

    let gid = message.guild.id;
    // console.time("database")
    let prefix = await this.client.db.getPrefix(gid);
    // console.timeEnd("database")

    const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = this.client
        .embed()
        .setColor(this.client.color.main)
        .setAuthor({
          name: `Nirvana Music`,
          iconURL: this.client.user.displayAvatarURL(),
        })
        .setThumbnail(this.client.user.displayAvatarURL())
        .setFooter({
          text: `Made By Nirvana Development.`,
          iconURL: this.client.user.displayAvatarURL(),
        }).setDescription(`Hey I'm Nirvana, A Best Quality Music Bot!

**Guild Settings**
Prefix : \`${prefix}\`
Language : Eng
Server I'd : \`${message.guild.id}\``);

      const compos = [
        {
          type: 2,
          style: 5,
          label: "Invite",
          url: "https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot",
          emoji: Emoji.invite,
        },
        {
          type: 2,
          style: 5,
          label: "Vote",
          url: "https://top.gg/bot/1044688839005966396/vote",
          emoji: Emoji.vote,
        },
        {
          type: 2,
          style: 5,
          label: "Support",
          url: "https://discord.gg/9bWCU6VPEM",
          emoji: Emoji.support,
        },
      ];
      await message.reply({
        embeds: [embed],
        components: [
          {
            type: 1,
            components: compos,
          },
        ],
      });
      return;
    }
    const hasnp = await this.client.db.hasNoPrefix(message.author.id);
    const escapeRegex = (str: string): string =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${this.client.user.id}>|${escapeRegex(prefix)}${
        hasnp ? "|" : ""
      })\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command =
      this.client.commands.get(cmd) ||
      this.client.commands.get(this.client.aliases.get(cmd) as string);
    if (!command) return;
    if (await this.client.db.isBlacklisted(message.author.id, message.guild.id))
      return;

    const ctx = new Context(message, args);
    ctx.setArgs(args);

    if (
      !message.guild.members.me.permissions.has(
        PermissionFlagsBits.SendMessages
      )
    )
      return await message.author
        .send({
          content: `I don't have **\`SendMessage\`** permission in \`${message.guild.name}\`\nchannel: <#${message.channelId}>`,
        })
        .catch(() => {});

    if (
      !message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)
    )
      return await message.reply({
        content: "I don't have **`EmbedLinks`** permission.",
      });

    if (command.permissions) {
      if (command.permissions.client) {
        if (
          !message.guild.members.me.permissions.has(command.permissions.client)
        )
          return await message.reply({
            content: "I don't have enough permissions to execute this command.",
          });
      }

      if (command.permissions.user) {
        if (!message.member.permissions.has(command.permissions.user))
          return await message.reply({
            content: "You don't have enough permissions to use this command.",
          });
      }
      if (command.permissions.dev) {
        if (this.client.config.owners) {
          const findDev = this.client.config.owners.find(
            (x) => x === message.author.id
          );
          if (!findDev) return;
        }
      }
    }
    if (command.player) {
      if (command.player.voice) {
        if (!message.member.voice.channel)
          return await message.reply({
            content: `You must be connected to a voice channel to use this \`${command.name}\` command.`,
          });

        if (
          !message.guild.members.me.permissions.has(PermissionFlagsBits.Speak)
        )
          return await message.reply({
            content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
          });

        if (
          !message.guild.members.me.permissions.has(PermissionFlagsBits.Speak)
        )
          return await message.reply({
            content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
          });

        if (
          message.member.voice.channel.type === ChannelType.GuildStageVoice &&
          !message.guild.members.me.permissions.has(
            PermissionFlagsBits.RequestToSpeak
          )
        )
          return await message.reply({
            content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
          });

        if (message.guild.members.me.voice.channel) {
          if (
            message.guild.members.me.voice.channelId !==
            message.member.voice.channelId
          )
            return await message.reply({
              content: `You are not connected to <#${message.guild.members.me.voice.channel.id}> to use this \`${command.name}\` command.`,
            });
        }
      }
      if (command.player.active) {
        if (!this.client.queue.get(message.guildId))
          return await message.reply({
            content: "Nothing is playing right now.",
          });
        if (!this.client.queue.get(message.guildId).queue)
          return await message.reply({
            content: "Nothing is playing right now.",
          });
        if (!this.client.queue.get(message.guildId).current)
          return await message.reply({
            content: "Nothing is playing right now.",
          });
      }
      // if (command.player.dj) {
      //     const dj = this.client.db.getDj(message.guildId);
      //     if (dj && dj.mode) {
      //         const djRole = this.client.db.getRoles(message.guildId);
      //         if (!djRole)
      //             return await message.reply({
      //                 content: 'DJ role is not set.',
      //             });
      //         const findDJRole = message.member.roles.cache.find((x: any) =>
      //             djRole.map((y: any) => y.roleId).includes(x.id)
      //         );
      //         if (!findDJRole) {
      //             if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      //                 return await message
      //                     .reply({
      //                         content: 'You need to have the DJ role to use this command.',
      //                     })
      //                     .then(msg => setTimeout(() => msg.delete(), 5000));
      //             }
      //         }
      //     }
      // }
    }
    if (command.args) {
      if (!args.length) {
        const embed = this.client
          .embed()
          .setColor(this.client.color.red)
          .setAuthor({
            name: `${command.category}`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setDescription(`${command.description.content}`)
          .setFields(
            {
              name: `Usage`,
              value: `\`${prefix}${command.description.usage}\``,
            },
            {
              name: `Aliases`,
              value: `\`${command.aliases}\``,
            }
          );
        return await message.reply({
          embeds: [embed],
        });
      }
    }

    const collector = message.createMessageComponentCollector();
    collector.on("collect", async (i) => {
      await i.deferReply({
        ephemeral: true,
      });
      switch (i.customId) {
        case "help":
          i.reply({
            embeds: [
              this.client
                .embed()
                .setColor(this.client.color.main)
                .setTitle(
                  `[Help for command: ${command.name}](https://discord.gg/9bWCU6VPEM)`
                )

                .setFields(),
            ],
          });
          break;
      }
    });

    if (
      command.vote &&
      !this.client.config.owners.includes(message.author.id)
    ) {
      const voted = await this.client.topGG.hasVoted(message.author.id);
      if (voted === false) {
        const embed = this.client
          .embed()
          .setTitle(`Vote For Me!`)
          .setDescription(`You Need To Vote For Me To Use This Command!`)
          .setColor(this.client.color.main);
        const compos = [
          {
            type: 2,
            style: 5,
            label: "Vote",
            url: "https://top.gg/bot/1044688839005966396/vote",
            emoji: Emoji.vote,
          },
        ];

        return await message.reply({
          embeds: [embed],
          components: [
            {
              type: 1,
              components: compos,
            },
          ],
        });
      }
    }

    if (!this.client.cooldown.has(cmd)) {
      this.client.cooldown.set(cmd, new Collection());
    }
    const now = Date.now();
    const timestamps = this.client.cooldown.get(cmd);

    const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      const timeLeft = (expirationTime - now) / 1000;
      if (now < expirationTime && timeLeft > 0.9) {
        return await message.reply({
          content: `Please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${cmd}\` command.`,
        });
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    if (args.includes("@everyone") || args.includes("@here"))
      return await message.reply({
        content: "You can't use this command with everyone or here.",
      });

    try {
      return command.run(this.client, ctx, ctx.args).catch((err) => {
        this.client.logger.error("Command", err);
      });
    } catch (error) {
      this.client.logger.error("MessageCreate Event", error);
      await message.reply({ content: `An error occurred: \`${error}\`` });
      return;
    }
  }
}
