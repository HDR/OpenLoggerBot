const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const moment = require("moment");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.GuildMemberUpdate, async(OldGuildMember, NewGuildMember) => {
    if (await tableExists(NewGuildMember.guild.id)) {
        if(await eventState(NewGuildMember.guild.id, 'guildMemberUpdate')) {
            const auditLog = await NewGuildMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberUpdate,
            });

            let auditEntry = await auditLog.entries.first();
            if(!auditEntry) {return;}
            let { executor, reason } = auditEntry;
            if(OldGuildMember.pending && !NewGuildMember.pending) {
                let clear_time = moment.duration(moment(moment().now).diff(NewGuildMember.joinedAt))
                let timeToClear = clear_time.asSeconds() < 60 ? `${Math.round(clear_time.asSeconds())} seconds` : clear_time.humanize();
                let Embed = new EmbedBuilder();
                Embed.setColor('#90EE90')
                Embed.setAuthor({name: `${NewGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
                Embed.setDescription(`🎉 ${NewGuildMember} Cleared Onboarding`)
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                Embed.addFields({
                        name: '**Time Taken:**',
                        value: timeToClear
                    },
                    {
                        name: '**ID**',
                        value: `\`\`\`ansi\n[0;32mMember ID: ${NewGuildMember.id}\`\`\``
                    })
                Embed.setTimestamp()
                try {
                    await NewGuildMember.guild.channels.cache.get(await eventState(NewGuildMember.guild.id, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = NewGuildMember.guild
                    console.log(e)
                }
            }

            if(executor !== client.user){
                if(OldGuildMember.nickname !== NewGuildMember.nickname) {
                    let Embed = new EmbedBuilder();
                    Embed.setAuthor({name: `${OldGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
                    console.log(NewGuildMember)
                    Embed.setDescription(`👤 ${NewGuildMember} 's nickname was updated`)

                    Embed.addFields(
                        {
                            name: 'Old Name',
                            value: `\`\`\`ansi\n[0;31m- ${OldGuildMember.displayName}\`\`\``,
                            inline: true
                        },
                        {
                            name: 'New Name',
                            value: `\`\`\`ansi\n[0;32m+ ${NewGuildMember.displayName}\`\`\``,
                            inline: true
                        },
                        {
                            name: 'ID',
                            value: `\`\`\`ansi\n[0;32mMember ID: ${OldGuildMember.id}\n[0;33mExecutor ID: ${executor.id}\`\`\``,
                            inline: false
                        }
                    )

                    Embed.setTimestamp()
                    Embed.setFooter({text: `${executor.username}#${executor.discriminator}`, iconURL: `${executor.avatarURL()}`})
                    try {
                        await NewGuildMember.guild.channels.cache.get(await eventState(NewGuildMember.guild.id, 'logChannel')).send({embeds: [Embed]});
                    } catch (e) {
                        e.guild = NewGuildMember.guild
                        console.log(e)
                    }
                }
            }

            if(NewGuildMember.isCommunicationDisabled()) {
                const Embed = new EmbedBuilder()
                Embed.setAuthor({name: `${NewGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
                Embed.setColor('#ff0000')
                Embed.setDescription(`🤐 ${NewGuildMember} has been timed out.`)
                Embed.addFields({
                        name: 'Reason',
                        value: `${reason}`,
                        inline: true
                    },
                    {
                        name: 'Until',
                        value: `<t:${Math.trunc(NewGuildMember.communicationDisabledUntilTimestamp / 1000)}:R>`,
                        inline: true
                    })
                Embed.setTimestamp()
                Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
                try {
                    await NewGuildMember.guild.channels.cache.get(await eventState(NewGuildMember.guild.id, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = NewGuildMember.guild
                    console.log(e)
                }
            }

            if(OldGuildMember.roles.cache.difference(NewGuildMember.roles.cache).size > 0) {
                let Embed = new EmbedBuilder();
                Embed.setAuthor({name: `${OldGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
                Embed.setDescription(`🎭 ${NewGuildMember}'s roles were updated`)
                let diff = OldGuildMember.roles.cache.difference(NewGuildMember.roles.cache)
                if(NewGuildMember.roles.cache.has(diff.first().id)) {
                    Embed.addFields({
                        name: 'Changes',
                        value: `➕ Added **${diff.first().name}**`
                    })
                } else {
                    Embed.addFields({
                        name: 'Changes',
                        value: `❌ Removed **${diff.first().name}**`
                    })
                }

                Embed.addFields({
                    name: 'ID',
                    value: `\`\`\`ansi\n[0;32mMember ID: ${OldGuildMember.id}\n[0;35mRole ID: ${diff.first().id}\`\`\``
                })
                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                try {
                    await NewGuildMember.guild.channels.cache.get(await eventState(NewGuildMember.guild.id, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = NewGuildMember.guild
                    console.log(e)
                }
            }
        }
    }

})