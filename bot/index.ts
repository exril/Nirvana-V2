import { Events } from 'discord.js';
import { Bot } from './Clients/Bot.client.js';
import config from './config.json' with { type: 'json'};

const client: Bot = new Bot();
client.run(config.token).catch(err => {console.log(err)});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isStringSelectMenu()) return;
    const player = client.queue.get(interaction.guild!.id);
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "f")
            switch (interaction.values[0]) {
                case 'reset':
                    player.player.clearFilters();
                    player.filters = [];
                    await interaction.reply({
                        content: `Successfully cleared all Filters!`,
                        ephemeral: true
                    })
                    break;

                case '8':
                    const eightdEnabled = player.filters.includes("8D");
                    const rotationConfig = eightdEnabled ? {} : { rotationHz: 0.2 };
                    await player.player.setRotation(rotationConfig);

                    if (eightdEnabled) {
                        player.filters = player.filters.filter((filter) => filter !== "8D");
                        await interaction.reply({
                            content: `Disabled the **8D** Filter!`,
                            ephemeral: true
                        });
                    } else {
                        player.filters.push("8D");
                        interaction.reply({
                            content: `Enabled the **8D** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'bb':
                    const bbEnabled = player.filters.includes("bassboost");

                    if (bbEnabled) {
                        await player.player.setEqualizer([]);
                        player.filters = player.filters.filter((filter) => filter !== "bassboost");
                        interaction.reply({
                            content: `Disabled the **BassBoost** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        await player.player.setEqualizer([
                            { band: 0, gain: 0.34 },
                            { band: 1, gain: 0.34 },
                            { band: 2, gain: 0.34 },
                            { band: 3, gain: 0.34 },
                        ]);
                        player.filters.push("bassboost");
                        interaction.reply({
                            content: `Enabled the **BassBoost** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'd':
                    const dEnabled = player.filters.includes("distorsion");

                    if (dEnabled) {
                        await player.player.setDistortion({});
                        player.filters = player.filters.filter((filter) => filter !== "distorsion");
                        interaction.reply({
                            content: `Disabled the **Distortion** Filter!`,
                            ephemeral: true
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
                        interaction.reply({
                            content: `Enabled the **Distortion** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'k':
                    const kEnabled = player.filters.includes("karaoke");

                    if (kEnabled) {
                        await player.player.setKaraoke();
                        player.filters = player.filters.filter((filter) => filter !== "karaoke");
                        interaction.reply({
                            content: `Disabled the **Karaoke** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        await player.player.setKaraoke({
                            level: 1,
                            monoLevel: 1,
                            filterBand: 220,
                            filterWidth: 100,
                        });
                        player.filters.push("karaoke");
                        interaction.reply({
                            content: `Enabled the **Karaoke** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'l':
                    const lEnabled = player.filters.includes("lowpass");

                    if (lEnabled) {
                        await player.player.setLowPass({ smoothing: 0 });
                        player.filters = player.filters.filter((filter) => filter !== "lowpass");
                        interaction.reply({
                            content: `Disabled the **Lofi** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        await player.player.setLowPass({ smoothing: 20 });
                        player.filters.push("lowpass");
                        interaction.reply({
                            content: `Enabled the **Lofi** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'nc':
                    const ncEnabled = player.filters.includes("nightcore");

                    if (ncEnabled) {
                        await player.player.setTimescale({});
                        player.filters = player.filters.filter((filter) => filter !== "nightcore");
                        interaction.reply({
                            content: `Disabled the **NightCore** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        await player.player.setTimescale({ rate: 1.2 });
                        player.filters.push("nightcore");
                        interaction.reply({
                            content: `Enabled the **NightCore** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'p':
                    let strFloat = "13.65"
                    const pitch = parseFloat(strFloat);
                    await player.player.setTimescale({ pitch });
                    interaction.reply({
                        content: `Enabled the **Pitch** Filter!`,
                        ephemeral: true
                    })
                    break;

                case 'ra':
                    const rateString = "13.65";
                    const rate = parseFloat(rateString);
                    await player.player.setTimescale({ rate });
                    interaction.reply({
                        content: `Enabled the **Rate** Filter!`,
                        ephemeral: true
                    })
                    break;

                case 'ro':
                    if (player.filters.includes("rotation")) {
                        player.player.setRotation();
                        player.filters = player.filters.filter((filter) => filter !== "rotation");
                        interaction.reply({
                            content: `Disabled the **Rotation** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        player.player.setRotation({ rotationHz: 0 });
                        player.filters.push("rotation");
                        interaction.reply({
                            content: `Enabled the **Rotation** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 's':
                    const speedString = "13.65"
                    const speed = parseFloat(speedString);
                    player.player.setTimescale({ speed });
                    interaction.reply({
                        content: `Enabled the **Speedy** Filter!`,
                        ephemeral: true
                    })
                    break;

                case 't':
                    const tEnabled = player.filters.includes("tremolo");
                    if (tEnabled) {
                        player.player.setTremolo();
                        player.filters.splice(player.filters.indexOf("tremolo"), 1);
                        interaction.reply({
                            content: `Disabled the **Tremolo** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        player.player.setTremolo({ depth: 0.75, frequency: 4 });
                        player.filters.push("tremolo");
                        interaction.reply({
                            content: `Enabled the **Tremolo** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;

                case 'v':
                    const vEnabled = player.filters.includes("vibrato");
                    if (vEnabled) {
                        player.player.setVibrato();
                        player.filters.splice(player.filters.indexOf("vibrato"), 1);
                        interaction.reply({
                            content: `Disabled the **Vibrato** Filter!`,
                            ephemeral: true
                        })
                    } else {
                        player.player.setVibrato({ depth: 0.75, frequency: 4 });
                        player.filters.push("vibrato");
                        interaction.reply({
                            content: `Enabled the **Vibrato** Filter!`,
                            ephemeral: true
                        })
                    }
                    break;
            }
    }
});


process.on('unhandledRejection', (reason, promise) => {
    client.logger.error(String(reason), String(promise));
    console.log(reason,promise)
});

process.on('uncaughtException', (err, origin) => {
    client.logger.error(String(err), String(origin));
    console.log(err,origin)
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    client.logger.error(String(err), String(origin));
    console.log(err,origin)
});
process.on('error',(err,origin) => { client.logger.error(String(err), String(origin));})