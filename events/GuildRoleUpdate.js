const {PermissionsBitField} = require("discord.js");
module.exports = {GuildRoleUpdate};
async function GuildRoleUpdate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.setColor(target.color)
    for (const [key, value] of Object.entries(changes)) {
        switch(value.key) {
            default:
                console.log(value)
                break;

            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${value.old}\`\nNew Name: \`${value.new}\``
                })
                break;

            case 'color':
                Embed.setColor(value.new)
                Embed.addFields({
                    name: 'Color',
                    value: `Old Color: \`#${value.old.toString(16)}\`\nNew Color: \`#${value.new.toString(16)}\``
                })
                break;

            case 'permissions':
                let addedPerm = new PermissionsBitField(String(value.new)).toArray().filter((e) => !new PermissionsBitField(String(value.old)).toArray().includes(e))
                let removedPerm = new PermissionsBitField(String(value.old)).toArray().filter((e) => !new PermissionsBitField(String(value.new)).toArray().includes(e))
                let permString = '';
                if(addedPerm.length > 0){
                    permString += `**Added** ${addedPerm.toString().replaceAll(",","\n**Added** ")}\n\n`
                }
                if(removedPerm.length > 0){
                    permString += `**Removed** ${removedPerm.toString().replaceAll(",","\n**Removed** ")}`
                }

                if(permString.length > 0) {
                    Embed.addFields({
                        name: 'Permissions',
                        value: `${permString}`
                    })
                }
                break;
            case 'managed':
                Embed.addFields({
                    name: 'Managed',
                    value: `Was: \`${value.old}\`\nIs: \`${value.new}\``
                })
                break;

            case 'mentionable':
                Embed.addFields({
                    name: 'Mentionable',
                    value: `Old State: \`${value.old}\`\nNew State: \`${value.new}\``
                })
                break;

            case 'hoist':
                Embed.addFields({
                    name: 'Display role separately',
                    value: `Old State: \`${value.old}\`\nNew State: \`${value.new}\``
                })
                break;

            case 'rawPosition':
                //Ignore
                break;

            case 'icon':
            case 'unicodeEmoji':
                Embed.addFields({
                    name: 'Role Icon',
                    value: `Old Icon: ${value.old}\n\nNew Icon: ${value.new}`
                })
                break;
        }
    }

    Embed.setDescription(`Role ${target} (${target.id}) was updated`)
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mRole = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}