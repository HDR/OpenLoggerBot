const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");
const moment = require("moment");

module.exports = {GuildMemberRemove};
async function GuildMemberRemove(AuditEntry, Guild, Embed) {
    const {executor, target, reason} = await AuditEntry;
    if(!target) return;
    Embed.setAuthor({name: `${target.tag}`, iconURL: `${target.displayAvatarURL()}`})
    Embed.setColor('#ff2828');
    Embed.setDescription(`🥾 <@${target.id}> was kicked by <@${executor.id}>`)
    Embed.addFields(
        {
            name: '**Reason**',
            value: reason ? reason: 'No reason provided',
            inline: false
        },
        {
            name: '**User Information**',
            value: `${target.tag} (${target.id}) <@${target.id}>`,
            inline: false
        },
        {
            name: '**Account Creation Date**',
            value: target.createdTimestamp ? `<t:${Math.trunc(target.createdTimestamp / 1000)}:F>` : "Unknown",
            inline: true
        },
        {
            name: '**IDs**',
            value: `\`\`\`ansi\n[0;33mMember ID = ${target.id}\n[0;34mGuild ID = ${Guild.id}\`\`\``,
            inline: false
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}

client.on(Events.GuildMemberRemove, async(GuildMember) => {
    if (await tableExists(GuildMember.guild.id)) {
        if(await eventState(GuildMember.guild.id, 'guildMemberRemove')) {
            let kickLog = await GuildMember.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberKick});
            let banLog = await GuildMember.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberBanAdd});
            const checkLog = (log, type) => {
                const entry = log.entries.first();
                if (!entry) return false;
                const timeDifference = Math.ceil(moment().diff(entry.createdTimestamp, 'seconds', true));
                return entry.target.id === GuildMember.id && timeDifference < 10;
            };

            if (!checkLog(kickLog, AuditLogEvent.MemberKick) && !checkLog(banLog, AuditLogEvent.MemberBanAdd)) {
                const Embed = new EmbedBuilder();
                Embed.setColor('#ff2828');
                Embed.setAuthor({name: `${GuildMember.user.tag}`, iconURL: `${GuildMember.displayAvatarURL()}`})
                Embed.setDescription(`💨 ${GuildMember} left the server`)
                Embed.addFields(
                    {
                        name: '**User Information**',
                        value: `${GuildMember.user.tag} (${GuildMember.user.id}) <@${GuildMember.user.id}>`,
                        inline: false
                    },
                    {
                        name: '**Roles**',
                        value: GuildMember.roles.cache.size ? `\`\`\`${GuildMember.roles.cache.map(r => r.name).join(', ')}\`\`\`` : 'No Roles',
                        inline: false
                    },
                    {
                        name: '**Joined At**',
                        value: `<t:${Math.trunc(GuildMember.joinedTimestamp / 1000)}:F>`,
                        inline: true
                    },
                    {
                        name: '**Account Creation Date**',
                        value: `<t:${Math.trunc(GuildMember.user.createdTimestamp / 1000)}:F>`,
                        inline: true
                    },
                    {
                        name: '**IDs**',
                        value: `\`\`\`ansi\n[0;32mMember ID: ${GuildMember.user.id}\n[0;36mGuild ID: ${GuildMember.guild.id}\`\`\``,
                        inline: false
                    }
                )
                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                try {
                    await GuildMember.guild.channels.cache.get(await eventState(GuildMember.guild.id, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = GuildMember.guild
                    console.log(e)
                }
            }
        }
    }
});