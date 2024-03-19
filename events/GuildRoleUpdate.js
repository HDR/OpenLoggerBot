const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const {getObjectDiffKey} = require("../commonFunctions");
const servers = require("../servers.json");


client.on(Events.GuildRoleUpdate, async (OldGuildRole, NewGuildRole) => {
    let Embed = new EmbedBuilder()
    Embed.setColor(NewGuildRole.color)

    const audit = await OldGuildRole.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate,
    });

    let addedPerm= NewGuildRole.permissions.toArray().filter((e) => !OldGuildRole.permissions.toArray().includes(e))
    let removedPerm = OldGuildRole.permissions.toArray().filter((e) => !NewGuildRole.permissions.toArray().includes(e))

    for (const [key, value] of Object.entries(getObjectDiffKey(OldGuildRole, NewGuildRole))) {
        switch(value) {
            default:
                console.log(value)
                break;

            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${OldGuildRole.name}\`\nNew Name: \`${NewGuildRole.name}\``
                })
                break;

            case 'color':
                Embed.setColor(NewGuildRole.color)
                Embed.addFields({
                    name: 'Color',
                    value: `Old Color: \`#${OldGuildRole.color.toString(16)}\`\nNew Color: \`#${NewGuildRole.color.toString(16)}\``
                })
                break;

            case 'permissions':
                let permString = '';
                if(addedPerm.length > 0){
                    permString += `**Added** ${addedPerm.toString().replaceAll(",","\n**Added** ")}\n\n`
                }
                if(removedPerm.length > 0){
                    permString += `**Removed** ${removedPerm.toString().replaceAll(",","\n**Removed** ")}`
                }

                Embed.addFields({
                    name: 'Permissions',
                    value: `${permString}`
                })
                break;

            case 'managed':
                Embed.addFields({
                    name: 'Managed',
                    value: `Was: \`${OldGuildRole.managed}\`\nIs: \`${NewGuildRole.managed}\``
                })
                break;

            case 'mentionable':
                Embed.addFields({
                    name: 'Mentionable',
                    value: `Old State: \`${OldGuildRole.mentionable}\`\nNew State: \`${NewGuildRole.mentionable}\``
                })
                break;

            case 'hoist':
                Embed.addFields({
                    name: 'Display role separately',
                    value: `Old State: \`${OldGuildRole.hoist}\`\nNew State: \`${NewGuildRole.hoist}\``
                })
                break;

            case 'rawPosition':
                Embed.addFields({
                    name: 'Role Position',
                    value: `Old Position: \`${OldGuildRole.rawPosition}\`\nNew Position: \`${NewGuildRole.rawPosition}\``
                })
                break;

            case 'icon':
            case 'unicodeEmoji':
                Embed.addFields({
                    name: 'Role Icon',
                    value: `Old Icon: ${OldGuildRole.iconURL()}\n\nNew Icon: ${NewGuildRole.iconURL()}`
                })
                break;
        }
    }

    Embed.setDescription(`Role \`${NewGuildRole.name}\` (${NewGuildRole.id}) was updated`)
    Embed.addFields(
       {
           name: 'ID',
           value: `\`\`\`ansi\n[0;33mRole = ${NewGuildRole.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
       }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    if(servers[OldGuildRole.guild.id]){await OldGuildRole.guild.channels.cache.get(servers[OldGuildRole.guild.id]).send({embeds: [Embed]});}
})