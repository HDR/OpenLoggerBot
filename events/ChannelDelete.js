const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, ChannelType} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.ChannelDelete, async(GuildChannel) => {
    if (await tableExists(GuildChannel.guildId)) {
        if(await eventState(GuildChannel.guildId, 'channelDelete')) {
            const auditLog = await GuildChannel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelDelete,
            });

            const auditEntry = auditLog.entries.first();
            const {executor} = auditEntry;

            if (auditEntry) {
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
                        value: `<t:${Math.trunc(GuildChannel.createdTimestamp / 1000)}:F>`
                    },
                    {
                        name: 'Type',
                        value: `${ChannelType[GuildChannel.type]}`,
                        inline: false
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${executor.id}\n[0;35mChannel = ${GuildChannel.id}\`\`\``,
                        inline: false
                    }
                )

                await GuildChannel.guild.channels.cache.get(await eventState(GuildChannel.guildId, 'logChannel')).send({embeds: [Embed]});
            }
        }
    }
});