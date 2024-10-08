import { Command } from '../../../../Structures/Command.structure.js';
import { Bot } from '../../../../Clients/Bot.client.js';
import Context from '../../../../Structures/Context.structure.js';
import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js';

export default class BassBoost extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "filter",
            description: {
                content: "on/off any filter",
                examples: ["filter"],
                usage: "filter",
            },
            category: "Filters",
            aliases: ["filters"],
            cooldown: 3,
            isPremium: false,
            args: false,
            vote: true,
            player: {
                voice: true,
                dj: true,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Bot, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const embed = this.client
            .embed()
            .setTitle(`Audio Filters`)
            .setColor(this.client.color.main)
            .setDescription(`Select any type of modification you want.`)

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('f')
                    .setPlaceholder(`Select Filters`)
                    .addOptions([
                        {
                            label: 'Reset Filters',
                            description: 'Clears all filters.',
                            value: 'reset'
                        },
                        {
                            label: '8D',
                            description: 'Sets the 8D Filter.',
                            value: '8'
                        },
                        {
                            label: 'BassBoost',
                            description: 'Sets the BassBoost Filter.',
                            value: 'bb'
                        },
                        {
                            label: 'Distortion',
                            description: 'Sets the distortion Filter.',
                            value: 'd'
                        },
                        {
                            label: 'Karaoke',
                            description: 'Sets the Karaoke Filter.',
                            value: 'k'
                        },
                        {
                            label: 'Lofi',
                            description: 'Sets the Lofi Filter.',
                            value: 'l'
                        },
                        {
                            label: 'NightCore',
                            description: 'Sets the NightCore Filter.',
                            value: 'nc'
                        },
                        {
                            label: 'Pitch',
                            description: 'Sets the Pitch Filter.',
                            value: 'p'
                        },
                        {
                            label: 'Rate',
                            description: 'Sets the Rate Filter.',
                            value: 'ra'
                        },
                        {
                            label: 'Rotation',
                            description: 'Sets the Rotation Filter.',
                            value: 'ro'
                        },
                        {
                            label: 'Speed',
                            description: 'Sets the Speedy Filter.',
                            value: 's'
                        },
                        {
                            label: 'Tremolo',
                            description: 'Sets the Tremolo Filter.',
                            value: 't'
                        },
                        {
                            label: 'Vibrato',
                            description: 'Sets the Vibrato Filter.',
                            value: 'v'
                        }
                    ])
            )
        const m = await ctx.sendMessage({
            embeds: [embed],
            components: [row]
        });

        const collector = m.createMessageComponentCollector({
            filter: (x: { user: { id: string; }; deferUpdate: () => any; }) =>
                x.user.id === ctx.author.id ? true : false && x.deferUpdate(),
            componentType: ComponentType.StringSelect,
            time: 600000,
            idle: 600000 / 2
        });

        collector.on("collect", async (i) => {
            await i.deferReply({
                ephemeral: true
            });
            if (i.customId === "f")
                switch (i.values[0]) {
                    case 'reset':
                        player.player.clearFilters();
                        player.filters = [];
                        i.editReply({
                            content: `Successfully cleared all Filters!`
                        })
                        break;

                    case '8':
                        const eightdEnabled = player.filters.includes("8D");
                        const rotationConfig = eightdEnabled ? {} : { rotationHz: 0.2 };
                        await player.player.setRotation(rotationConfig);

                        if (eightdEnabled) {
                            player.filters = player.filters.filter((filter) => filter !== "8D");
                            i.editReply({
                                content: `Disabled the **8D** Filter!`
                            });
                        } else {
                            player.filters.push("8D");
                            i.editReply({
                                content: `Enabled the **8D** Filter!`
                            })
                        }
                        break;

                    case 'bb':
                        const bbEnabled = player.filters.includes("bassboost");

                        if (bbEnabled) {
                            await player.player.setEqualizer([]);
                            player.filters = player.filters.filter((filter) => filter !== "bassboost");
                            i.editReply({
                                content: `Disabled the **BassBoost** Filter!`
                            })
                        } else {
                            await player.player.setEqualizer([
                                { band: 0, gain: 0.34 },
                                { band: 1, gain: 0.34 },
                                { band: 2, gain: 0.34 },
                                { band: 3, gain: 0.34 },
                            ]);
                            player.filters.push("bassboost");
                            i.editReply({
                                content: `Enabled the **BassBoost** Filter!`
                            })
                        }
                        break;

                    case 'd':
                        const dEnabled = player.filters.includes("distorsion");

                        if (dEnabled) {
                            await player.player.setDistortion({});
                            player.filters = player.filters.filter((filter) => filter !== "distorsion");
                            i.editReply({
                                content: `Disabled the **Distortion** Filter!`
                            })
                        } else {
                            await player.player.setDistortion({
                                sinOffset: 0,
                                sinScale: 1,
                                cosOffset: 0,
                                cosScale: 1,
                                tanOffset: 0,
                                tanScale: 1,
                                offset: 0,
                                scale: 1,
                            });
                            player.filters.push("distorsion");
                            i.editReply({
                                content: `Enabled the **Distortion** Filter!`
                            })
                        }
                        break;

                    case 'k':
                        const kEnabled = player.filters.includes("karaoke");

                        if (kEnabled) {
                            await player.player.setKaraoke();
                            player.filters = player.filters.filter((filter) => filter !== "karaoke");
                            i.editReply({
                                content: `Disabled the **Karaoke** Filter!`
                            })
                        } else {
                            await player.player.setKaraoke({
                                level: 1,
                                monoLevel: 1,
                                filterBand: 220,
                                filterWidth: 100,
                            });
                            player.filters.push("karaoke");
                            i.editReply({
                                content: `Enabled the **Karaoke** Filter!`
                            })
                        }
                        break;

                    case 'l':
                        const lEnabled = player.filters.includes("lowpass");

                        if (lEnabled) {
                            await player.player.setLowPass({ smoothing: 0 });
                            player.filters = player.filters.filter((filter) => filter !== "lowpass");
                            i.editReply({
                                content: `Disabled the **Lofi** Filter!`
                            })
                        } else {
                            await player.player.setLowPass({ smoothing: 20 });
                            player.filters.push("lowpass");
                            i.editReply({
                                content: `Enabled the **Lofi** Filter!`
                            })
                        }
                        break;

                    case 'nc':
                        const ncEnabled = player.filters.includes("nightcore");

                        if (ncEnabled) {
                            await player.player.setTimescale({});
                            player.filters = player.filters.filter((filter) => filter !== "nightcore");
                            i.editReply({
                                content: `Disabled the **NightCore** Filter!`
                            })
                        } else {
                            await player.player.setTimescale({ rate: 1.2 });
                            player.filters.push("nightcore");
                            i.editReply({
                                content: `Enabled the **NightCore** Filter!`
                            })
                        }
                        break;

                    case 'p':
                        let strFloat = "13.65"
                        const pitch = parseFloat(strFloat);
                        await player.player.setTimescale({ pitch });
                        i.editReply({
                            content: `Enabled the **Pitch** Filter!`
                        })
                        break;

                    case 'ra':
                        const rateString = "13.65";
                        const rate = parseFloat(rateString);
                        await player.player.setTimescale({ rate });
                        i.editReply({
                            content: `Enabled the **Rate** Filter!`
                        })
                        break;

                    case 'ro':
                        if (player.filters.includes("rotation")) {
                            player.player.setRotation();
                            player.filters = player.filters.filter((filter) => filter !== "rotation");
                            i.editReply({
                                content: `Disabled the **Rotation** Filter!`
                            })
                        } else {
                            player.player.setRotation({ rotationHz: 0 });
                            player.filters.push("rotation");
                            i.editReply({
                                content: `Enabled the **Rotation** Filter!`
                            })
                        }
                        break;

                    case 's':
                        const speedString = "13.65"
                        const speed = parseFloat(speedString);
                        player.player.setTimescale({ speed });
                        i.editReply({
                            content: `Enabled the **Speedy** Filter!`
                        })
                        break;

                    case 't':
                        const tEnabled = player.filters.includes("tremolo");
                        if (tEnabled) {
                            player.player.setTremolo();
                            player.filters.splice(player.filters.indexOf("tremolo"), 1);
                            i.editReply({
                                content: `Disabled the **Tremolo** Filter!`
                            })
                        } else {
                            player.player.setTremolo({ depth: 0.75, frequency: 4 });
                            player.filters.push("tremolo");
                            i.editReply({
                                content: `Enabled the **Tremolo** Filter!`
                            })
                        }
                        break;

                    case 'v':
                        const vEnabled = player.filters.includes("vibrato");
                        if (vEnabled) {
                            player.player.setVibrato();
                            player.filters.splice(player.filters.indexOf("vibrato"), 1);
                            i.editReply({
                                content: `Disabled the **Vibrato** Filter!`
                            })
                        } else {
                            player.player.setVibrato({ depth: 0.75, frequency: 4 });
                            player.filters.push("vibrato");
                            i.editReply({
                                content: `Enabled the **Vibrato** Filter!`
                            })
                        }
                        break;
                }
        });
    }
}