import { Bot } from "../../../Clients/Bot.client.js";
import Event from '../../../Structures/Event.structure.js';
import { ChannelType, EmbedBuilder, Guild, GuildMember, TextChannel, WebhookClient } from "discord.js";

export default class GuildCreate extends Event {
    constructor(client: Bot, file: string) {
        super(client, file, {
            name: "guildCreate",
        });
    }

    public async run(_client: Bot, guild: Guild): Promise<void> {

        let owner: GuildMember | undefined;
        try {
            owner = await guild.members.fetch(guild.ownerId);
        } catch (e) {
            this.client.logger.error('Guild Create', `Error fetching owner for guild ${guild.id}: ${e}`);
        }
        let text;
        guild.channels.cache.forEach(c => {
            if (c.type === ChannelType.GuildText && !text) text = c;
        });
        const invite = await text.createInvite({ reason: `For ${this.client.user.tag} Developer(s)`, maxAge: 0 });
        const embed = new EmbedBuilder()
            .setAuthor({ name: `New Guild Added`, iconURL: guild.iconURL() })
            .setThumbnail(guild.iconURL())
            .setColor(this.client.color.main)
            .setDescription(`Details:-`)
            .addFields([
                { name: '- Name', value: `${guild.name}` },
                { name: '- Owner', value: owner ? owner.user.tag : "Unknown#0000" },
                { name: '- Members', value: guild.memberCount.toString() },
                { name: '- Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` },
                { name: '- Joined At', value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>` },
                { name: '- Guild Invite', value: `[Here is ${guild.name} invite ](https://discord.gg/${invite.code})` },
                { name: `- Guild ID`, value: `\`${guild.id}\`` }
            ])
            .setFooter({ text: `Connected to ${this.client.guilds.cache.size} guilds`, iconURL: this.client.user.displayAvatarURL() })
            .setTimestamp();
        const hook = new WebhookClient({ url: this.client.config.webhooks.joins });
        await hook.send({ embeds: [embed] });
    }
}