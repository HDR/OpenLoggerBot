const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, ChannelType} = require("discord.js");
const {eventState, tableExists} = require("../commonFunctions");

client.on(Events.ChannelCreate, async(GuildChannel) => {
    if (await tableExists(GuildChannel.guildId)) {
        if(await eventState(GuildChannel.guildId, 'channelCreate')) {
            const auditLog = await GuildChannel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate,
            });

            const auditEntry = auditLog.entries.first();
            const { executor } = auditEntry;

            if(auditEntry) {
                const Embed = new EmbedBuilder();
                Embed.setColor('#97ff28');
                Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
                Embed.setDescription(`${executor.tag} created a channel`)
                Embed.addFields(
                    {
                        name: 'Name',
                        value: `${GuildChannel.name} (${GuildChannel.id})`
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

                await GuildChannel.guild.channels.cache.get(await eventState(GuildChannel.guildId, 'logChannel')).send({embeds: [Embed]});
            }
        }
    }
});