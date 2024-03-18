const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const servers = require("../servers.json");

client.on(Events.GuildMemberRemove, async(GuildMember) => {
    GuildMember.guild.bans.fetch(GuildMember.id).then(e=> {}).catch(async e => {
        const auditLog = await GuildMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick
        });

        const auditEntry = auditLog.entries.first();
        const {executor, target, reason} = auditEntry;

        const Embed = new EmbedBuilder();
        Embed.setColor('#ff2828');
        Embed.setAuthor({name: `${GuildMember.user.tag}`, iconURL: `${GuildMember.displayAvatarURL()}`})
        Embed.addFields(
            {
                name: 'User Information',
                value: `${GuildMember.user.tag} (${GuildMember.user.id}) <@${GuildMember.user.id}>`,
                inline: false
            },
            {
                name: 'Roles',
                value: `\`\`\`${GuildMember.roles.cache.map(r => `${r.name}`)}\`\`\``,
                inline: false
            },
            {
                name: 'Joined At',
                value: `<t:${Math.trunc(GuildMember.joinedTimestamp / 1000)}:F>`,
                inline: true
            },
            {
                name: 'Created At',
                value: `<t:${Math.trunc(GuildMember.user.createdTimestamp / 1000)}:F>`,
                inline: true
            }
        )

        if (!auditEntry) {
            Embed.setDescription(`<@${GuildMember.user.id}> left the server`)
        } else {
            if (target.id === GuildMember.id && auditEntry.createdAt > GuildMember.joinedAt && auditEntry.action === AuditLogEvent.MemberKick) {
                Embed.setDescription(`<@${GuildMember.user.id}> was kicked by ${executor.tag} (${executor.id})`)
                Embed.addFields(
                    {
                        name: 'Reason',
                        value: reason,
                        inline: false
                    })
            } else {
                Embed.setDescription(`<@${GuildMember.user.id}> left the server`)
            }
        }

        Embed.addFields(
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${GuildMember.user.id}\n[0;34mGuild = ${GuildMember.guild.id}\`\`\``,
                inline: false
            }
        )


        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        if(servers[GuildMember.guild.id]){await GuildMember.guild.channels.cache.get(servers[GuildMember.guild.id]).send({embeds: [Embed]});}
    })
});