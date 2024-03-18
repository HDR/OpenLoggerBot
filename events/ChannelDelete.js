const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, ChannelType} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.ChannelDelete, async(GuildChannel) => {

    const auditLog = await GuildChannel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete,
    });

    const auditEntry = auditLog.entries.first();
    const { executor } = auditEntry;

    if(auditEntry) {
        const Embed = new EmbedBuilder();
        Embed.setColor('#ff2828');
        Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
        Embed.setDescription(`${executor.tag} deleted a channel`)
        Embed.addFields(
            {
                name: 'Name',
                value: `${GuildChannel.name} (${GuildChannel.id})`
            },
            {
                name: 'Created At',
                value: `<t:${Math.trunc(GuildChannel.createdTimestamp/1000)}:F>`
            },
            {
                name: 'Type',
                value:  `${ChannelType[GuildChannel.type]}`,
                inline: false
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${executor.id}\n[0;35mChannel = ${GuildChannel.id}\`\`\``,
                inline: false
            }
        )

        await GuildChannel.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }
});