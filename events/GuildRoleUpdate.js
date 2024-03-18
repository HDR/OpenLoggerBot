const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField } = require("discord.js");
const {getObjectDiffKey} = require("../commonFunctions");
const servers = require("../servers.json");


client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    let Embed = new EmbedBuilder()
    Embed.setColor(newRole.color)

    const audit = await oldRole.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate,
    });

    let addedPerm= newRole.permissions.toArray().filter((e) => !oldRole.permissions.toArray().includes(e))
    let removedPerm = oldRole.permissions.toArray().filter((e) => !newRole.permissions.toArray().includes(e))

    for (const [key, value] of Object.entries(getObjectDiffKey(oldRole, newRole))) {
        switch(value) {

            default:
                console.log(value)
                break;

            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${oldRole.name}\`\nNew Name: \`${newRole.name}\``
                })
                break;

            case 'color':
                Embed.setColor(newRole.color)
                Embed.addFields({
                    name: 'Color',
                    value: `Old Color: \`#${oldRole.color.toString(16)}\`\nNew Color: \`#${newRole.color.toString(16)}\``
                })
                break;

            case 'permissions':
                Embed.addFields({
                    name: 'Permissions',
                    value: `Added ${addedPerm.toString().replaceAll(",","\nAdded ")}\n\nRemoved ${removedPerm.toString().replaceAll(",","\nRemoved ")}`
                })
                break;

            case 'managed':
                Embed.addFields({
                    name: 'Managed',
                    value: `Was: \`${oldRole.managed}\`\nIs: \`${newRole.managed}\``
                })
                break;

            case 'mentionable':
                Embed.addFields({
                    name: 'Mentionable',
                    value: `Old State: \`${oldRole.mentionable}\`\nNew State: \`${newRole.mentionable}\``
                })
                break;

            case 'hoist':
                Embed.addFields({
                    name: 'Display role separately',
                    value: `Old State: \`${oldRole.hoist}\`\nNew State: \`${newRole.hoist}\``
                })
                break;

            case 'icon':
            case 'unicodeEmoji':
                Embed.addFields({
                    name: 'Role Icon',
                    value: `Old Icon: ${oldRole.iconURL()}\n\nNew Icon: ${newRole.iconURL()}`
                })
                break;
        }
    }

    Embed.setDescription(`Role \`${newRole.name}\` (${newRole.id}) was updated`)
    Embed.addFields(
       {
           name: 'ID',
           value: `\`\`\`ansi\n[0;33mRole = ${newRole.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
       }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    if(servers[oldRole.guild.id]){await oldRole.guild.channels.cache.get(servers[oldRole.guild.id]).send({embeds: [Embed]});}
})