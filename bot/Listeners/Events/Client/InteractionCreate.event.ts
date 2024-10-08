import {
    AutocompleteInteraction,
    ChannelType,
    Collection,
    CommandInteraction,
    GuildMember,
    InteractionType,
    PermissionFlagsBits,
} from 'discord.js';
import { LoadType } from 'shoukaku';

import Event from '../../../Structures/Event.structure.js';
import { Bot } from '../../../Clients/Bot.client.js';
import Context from '../../../Structures/Context.structure.js';
import { Emoji } from '../../../utils/Emotes.utils.js';
export default class InteractionCreate extends Event {
    constructor(client: Bot, file: string) {
        super(client, file, {
            name: 'interactionCreate',
        });
    }
    public async run(client: Bot, interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
        if (
            interaction instanceof CommandInteraction &&
            interaction.type === InteractionType.ApplicationCommand
        ) {
            if (
                !interaction.inGuild() ||
                !interaction.channel
                    .permissionsFor(interaction.guild.members.me)
                    .has(PermissionFlagsBits.ViewChannel)
            )
                return;

            const { commandName } = interaction;
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;
            if (await this.client.db.isBlacklisted(interaction.user.id, interaction.guild.id)) return;
            const ctx = new Context(interaction as any, interaction.options.data as any);
            ctx.setArgs(interaction.options.data as any);
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
                return await (interaction.member as GuildMember)
                    .send({
                        content: `I don't have **\`SendMessage\`** permission in \`${interaction.guild.name}\`\nchannel: <#${interaction.channelId}>`,
                    })
                    .catch(() => { });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
                return await interaction.reply({
                    content: 'I don\'t have **`EmbedLinks`** permission.',
                    ephemeral: true,
                });

            if (command.permissions) {
                if (command.permissions.client) {
                    if (!interaction.guild.members.me.permissions.has(command.permissions.client))
                        return await interaction.reply({
                            content: 'I don\'t have enough permissions to execute this command.',
                            ephemeral: true,
                        });
                }

                if (command.permissions.user) {
                    if (
                        !(interaction.member as GuildMember).permissions.has(
                            command.permissions.user
                        )
                    ) {
                        await interaction.reply({
                            content: 'You don\'t have enough permissions to use this command.',
                            ephemeral: true,
                        });
                        return;
                    }
                }
                if (command.permissions.dev) {
                    if (this.client.config.owners) {
                        const findDev = this.client.config.owners.find(
                            x => x === interaction.user.id
                        );
                        if (!findDev) return;
                    }
                }
            }
            if (command.player) {
                if (command.player.voice) {
                    if (!(interaction.member as GuildMember).voice.channel)
                        return await interaction.reply({
                            content: `<:error:1155964919309664307> You must be connected to a voice channel to use this \`${command.name}\` command.`,
                            ephemeral: true,
                        });

                    if (!interaction.guild.members.resolve(this.client.user).permissions.has(PermissionFlagsBits.Speak))
                        return await interaction.reply({
                            content: `<:error:1155964919309664307> I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
                            ephemeral: true,
                        });

                    if (!interaction.guild.members.resolve(this.client.user).permissions.has(PermissionFlagsBits.Speak))
                        return await interaction.reply({
                            content: `<:error:1155964919309664307> I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
                            ephemeral: true,
                        });

                    if (
                        (interaction.member as GuildMember).voice.channel.type === ChannelType.GuildStageVoice &&
                        !interaction.guild.members.resolve(this.client.user).permissions.has(PermissionFlagsBits.RequestToSpeak)
                    )
                        return await interaction.reply({
                            content: `<:error:1155964919309664307> I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
                            ephemeral: true,
                        });
                    if (interaction.guild.members.resolve(this.client.user).voice.channel) {
                        if (
                            interaction.guild.members.resolve(this.client.user).voice.channelId !==
                            (interaction.member as GuildMember).voice.channelId
                        )
                            return await interaction.reply({
                                content: `<:error:1155964919309664307> You are not connected to <#${interaction.guild.members.resolve(this.client.user).voice.channel.id
                                    }> to use \`${command.name}\` command.`,
                                ephemeral: true,
                            });
                    }
                }
                if (command.player.active) {
                    const queue = this.client.queue.get(interaction.guildId);
                    if (!(queue?.queue && queue.current))
                        return await interaction.reply({
                            content: "Nothing is playing right now.",
                            ephemeral: true,
                        });
                }
                // if (command.player.dj) {
                //     const dj = await this.client.db.getDj(interaction.guildId);
                //     if (dj?.mode) {
                //         const djRole = await this.client.db.getRoles(interaction.guildId);
                //         if (!djRole)
                //             return await interaction.reply({
                //                 content: "DJ role is not set.",
                //             });
                //         const findDJRole = (interaction.member as GuildMember).roles.cache.find((x: any) =>
                //             djRole.map((y: any) => y.roleId).includes(x.id),
                //         );
                //         if (!findDJRole) {
                //             if (!(interaction.member as GuildMember).permissions.has(PermissionFlagsBits.ManageGuild)) {
                //                 return await interaction.reply({
                //                     content: "You need to have the DJ role to use this command.",
                //                     ephemeral: true,
                //                 });
                //             }
                //         }
                //     }
                // }
            }

            if (command.vote && !this.client.config.owners.includes(interaction.user.id)) {
                const voted = await this.client.topGG.hasVoted(interaction.user.id);
                if (!voted) {
                    const embed = this.client
                        .embed()
                        .setTitle(`Vote For Me!`)
                        .setDescription(`You Need To Vote For Me To Use This Command!`)
                        .setColor(this.client.color.main);
                    const compos = [{
                        type: 2,
                        style: 5,
                        label: "Vote",
                        url: "https://top.gg/bot/1044688839005966396/vote",
                        emoji: Emoji.vote
                    }]

                    return await interaction.reply({
                        embeds: [embed],
                        components: [
                            {
                                type: 1,
                                components: compos
                            }
                        ],
                        ephemeral: true,
                    });
                }
            }

            if (!this.client.cooldown.has(commandName)) {
                this.client.cooldown.set(commandName, new Collection());
            }
            const now = Date.now();
            const timestamps = this.client.cooldown.get(commandName);

            const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
            if (!timestamps.has(interaction.user.id)) {
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            } else {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return await interaction.reply({
                        content: `Please wait ${timeLeft.toFixed(
                            1
                        )} more second(s) before reusing the \`${commandName}\` command.`,
                        ephemeral: true,
                    });
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }
            if (
                interaction.options.data.some(
                    option => option.value && option.value.toString().includes('@everyone')
                ) ||
                interaction.options.data.some(
                    option => option.value && option.value.toString().includes('@here')
                )
            )
                return await interaction.reply({
                    content: 'You can\'t mention everyone or here.',
                    ephemeral: true,
                });
            try {
                await command.run(this.client, ctx, ctx.args).catch(err => { this.client.logger.error('Command', err); });;
            } catch (error) {
                this.client.logger.error("InteractionCreate Event", error);
                await interaction.reply({ content: `An error occurred: \`${error}\``, ephemeral: true, });
            }
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            if ((interaction.commandName == 'play') || (interaction.commandName == 'playnext')) {
                const song = interaction.options.getString('song');
                const res = await this.client.queue.search(song);
                let songs = [];
                switch (res.loadType) {
                    case LoadType.SEARCH:
                        if (!res.data.length) return;
                        res.data.slice(0, 10).forEach(x => {
                            songs.push({
                                name: `${x.info.title} by ${x.info.author}`,
                                value: x.info.uri,
                            });
                        });
                        break;

                    default:
                        break;
                }

                return await interaction.respond(songs).catch(() => { });
            }
        }
    }
}