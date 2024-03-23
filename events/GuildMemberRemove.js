const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.GuildMemberRemove, async(GuildMember) => {
    if (await tableExists(GuildMember.guild.id)) {
        if(await eventState(GuildMember.guild.id, 'guildMemberRemove')) {
            GuildMember.guild.bans.fetch(GuildMember.id).then(e=> {}).catch(async e => {
                const auditLog = await GuildMember.guild.fetchAuditLogs({
                    limit: 1
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

                if(auditLog.entries.first().action === AuditLogEvent.MemberBanAdd || AuditLogEvent.MemberKick) {
                    if(auditLog.entries.first().action !== AuditLogEvent.MemberBanAdd) {
                        if (target.id === GuildMember.id && auditEntry.createdAt > GuildMember.joinedAt && auditEntry.action === AuditLogEvent.MemberKick) {
                            Embed.setDescription(`<@${GuildMember.user.id}> was kicked by ${executor.tag} (${executor.id})`)
                            let kickReason = 'None'
                            if(reason){
                                kickReason = reason.toString()
                            }
                            Embed.addFields(
                                {
                                    name: 'Reason',
                                    value: kickReason,
                                    inline: false
                                })
                        } else {
                            Embed.setDescription(`<@${GuildMember.user.id}> left the server`)
                        }
                    }
                } else {
                    Embed.setDescription(`<@${GuildMember.user.id}> left the server`)
                }

                if(Embed.data.description) {
                    Embed.addFields(
                        {
                            name: 'ID',
                            value: `\`\`\`ansi\n[0;33mMember = ${GuildMember.user.id}\n[0;34mGuild = ${GuildMember.guild.id}\`\`\``,
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
            })
        }
    }
});