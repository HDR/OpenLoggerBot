const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");
const moment = require("moment");

module.exports = {GuildMemberKick};
async function GuildMemberKick(AuditEntry, Guild, Embed) {
    const {executor, target, reason} = await AuditEntry;
    if(!target) return;
    Embed.setAuthor({name: `${target.tag}`, iconURL: `${target.displayAvatarURL()}`})
    Embed.setColor('#ff2828');
    Embed.setDescription(`<@${target.id}> was kicked by ${executor.tag} (${executor.id})`)
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
            name: '**Created At**',
            value: `<t:${Math.trunc(target.createdTimestamp / 1000)}:F>`,
            inline: true
        },
        {
            name: '**ID**',
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
                const timeDifference = Math.ceil(moment().diff(log.entries.first().createdTimestamp, 'seconds', true));
                return log.entries.first().target.id === GuildMember.id && timeDifference < 10;
            };

            if (!checkLog(kickLog, AuditLogEvent.MemberKick) && !checkLog(banLog, AuditLogEvent.MemberBanAdd)) {
                const Embed = new EmbedBuilder();
                Embed.setColor('#ff2828');
                Embed.setAuthor({name: `${GuildMember.user.tag}`, iconURL: `${GuildMember.displayAvatarURL()}`})
                Embed.setDescription(`<@${GuildMember.user.id}> left the server`)
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
                        name: '**Created At**',
                        value: `<t:${Math.trunc(GuildMember.user.createdTimestamp / 1000)}:F>`,
                        inline: true
                    },
                    {
                        name: '**ID**',
                        value: `\`\`\`ansi\n[0;33mMember ID: ${GuildMember.user.id}\n[0;34mGuild ID: ${GuildMember.guild.id}\`\`\``,
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