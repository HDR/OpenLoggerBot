const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const moment = require("moment");
const servers = require("../servers.json");

client.on(Events.GuildMemberUpdate, async(OldGuildMember, NewGuildMember) => {

    const auditLog = await OldGuildMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate,
    });

    let auditEntry = auditLog.entries.first();
    let { executor } = auditEntry;

    //Track people passing onboarding
    if(OldGuildMember.pending && !NewGuildMember.pending) {
        let clear_time = moment.duration(moment(moment().now).diff(NewGuildMember.joinedAt))
        if(clear_time.seconds() > 20) {
            let Embed = new EmbedBuilder();
            Embed.setColor('#90EE90')
            Embed.setAuthor({name: `${OldGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
            Embed.setDescription(`<@${OldGuildMember.user.id}> Cleared the rules`)
            Embed.addFields({
                name: 'Time Taken:',
                value: clear_time.humanize()
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${OldGuildMember.id}\`\`\``
            })
            Embed.setTimestamp()

            if(servers[OldGuildMember.guild.id]){await OldGuildMember.guild.channels.cache.get(servers[OldGuildMember.guild.id]).send({embeds: [Embed]});}

        } else {
            try {
                await NewGuildMember.send({content: `[${OldGuildMember.guild.name}] You have been automatically kicked, Please make sure you've read the rules properly.`})
            } catch(e) {
                console.log(e)
            }
            await NewGuildMember.kick('Cleared rules too fast')
        }
    }

    //Track Nickname Changes
    if(executor !== client.user){
        if(OldGuildMember.nickname !== NewGuildMember.nickname) {
            let Embed = new EmbedBuilder();
            Embed.setAuthor({name: `${OldGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
            Embed.setDescription(`<@${OldGuildMember.user.id}>'s nickname was updated`)

            if(NewGuildMember.nickname) {
                let normalize = NewGuildMember.nickname.normalize("NFKC")
                if(normalize !== NewGuildMember.nickname) {
                    NewGuildMember.setNickname(normalize)
                }
            }

            Embed.addFields(
                {
                    name: 'New Name',
                    value: `${NewGuildMember.displayName}`
                },
                {
                    name: 'Old Name',
                    value: `${OldGuildMember.displayName}`
                },
                {
                    name: 'ID',
                    value: `\`\`\`ansi\n[0;33mMember = ${OldGuildMember.id}\`\`\``
                }
            )

            Embed.setTimestamp()
            Embed.setFooter({text: `${executor.username}#${executor.discriminator}`, iconURL: `${executor.avatarURL()}`})
            if(servers[OldGuildMember.guild.id]){await OldGuildMember.guild.channels.cache.get(servers[OldGuildMember.guild.id]).send({embeds: [Embed]});}
        }
    }

    //Check if user was timed out
    if(NewGuildMember.isCommunicationDisabled()) {
        const Embed = new EmbedBuilder()
        Embed.setColor('#ff0000')
        Embed.setTitle(`${NewGuildMember.user.tag} has been timed out.`)
        if(servers[OldGuildMember.guild.id]){await OldGuildMember.guild.channels.cache.get(servers[OldGuildMember.guild.id]).send({embeds: [Embed]});}
    }

    //Track Role Changes
    if(OldGuildMember.roles.cache.difference(NewGuildMember.roles.cache).size > 0) {
        let Embed = new EmbedBuilder();
        Embed.setAuthor({name: `${OldGuildMember.user.tag}`, iconURL: `${NewGuildMember.user.displayAvatarURL()}`})
        Embed.setDescription(`<@${OldGuildMember.user.id}>'s roles were updated`)
        let diff = OldGuildMember.roles.cache.difference(NewGuildMember.roles.cache)
        if(NewGuildMember.roles.cache.has(diff.first().id)) {
            Embed.addFields(
                {
                    name: 'Changes',
                    value: `➕ Added **${diff.first().name}**`
                }
            )
        } else {
            Embed.addFields(
                {
                    name: 'Changes',
                    value: `❌ Removed **${diff.first().name}**`
                }
            )
        }

        Embed.addFields(
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${OldGuildMember.id}\n[0;37mRole = ${diff.first().id}\`\`\``
            }
        )
        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        if(servers[OldGuildMember.guild.id]){await OldGuildMember.guild.channels.cache.get(servers[OldGuildMember.guild.id]).send({embeds: [Embed]});}
    }

})