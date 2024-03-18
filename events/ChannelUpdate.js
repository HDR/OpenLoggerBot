const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField} = require("discord.js");
const { log_channel } = require("./config/events.json")
const {OverwriteType} = require("discord-api-types/v10");

function permissionResolver(permission) {
    const result = [];

    for (const perm of Object.keys(PermissionsBitField.Flags)) {
        if(permission.has(PermissionsBitField.Flags[perm])) {
            result.push(perm);
        }
    }
    return result;
}

client.on(Events.ChannelUpdate, async(oldChannel, newChannel) => {

    let auditLog = await oldChannel.guild.fetchAuditLogs({
        limit: 1
    });

    let auditEntry = auditLog.entries.first();
    let { executor, changes, extra } = auditEntry;

    if(auditEntry) {
        let Embed = new EmbedBuilder();
        Embed.setColor('#97ff28');
        Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
        Embed.setDescription(`${executor.tag} edited channel ${newChannel.name} (${newChannel.id})`)

        if(auditEntry.action === AuditLogEvent.ChannelUpdate) {
            changes.forEach((item) => {
                Embed.addFields(
                    {
                        name: `${(item.key.charAt(0).toUpperCase()+item.key.slice(1)).replaceAll(`_`,' ')}`,
                        value: `New: ${item.new}\nOld: ${item.old}`
                    }
                )
            })
        } else {
            if (auditEntry.action === AuditLogEvent.ChannelOverwriteCreate || AuditLogEvent.ChannelOverwriteUpdate || AuditLogEvent.ChannelOverwriteDelete) {
                changes.forEach((item, index) => {
                    if (changes[0].key === 'id') {
                        if(changes[0].old === undefined && index === 0) {
                            Embed.addFields(
                                {
                                    name: `A Permission target was added`,
                                    value: `Role/User: ${extra.name} (${extra.id})`
                                }
                            )
                        }
                        if(changes[0].new === undefined && index === 0){
                            Embed.addFields(
                                {
                                    name: `A Permission target was removed`,
                                    value: `Role/User: ${extra.name} (${extra.id})`
                                }
                            )
                        }

                    } else {
                        if(index === 0){
                            try {
                                let channelPermissions = newChannel.permissionOverwrites.resolve(extra.id)
                                let newPerm = permissionResolver(new PermissionsBitField(changes[0].new))
                                let oldPerm = permissionResolver(new PermissionsBitField(changes[0].old))

                                let newString = "";
                                let oldString = "";

                                for (let [key, value] of Object.entries(newPerm)) {
                                    newString += `\nAllow: ${value}`
                                }

                                for (let [key, value] of Object.entries(oldPerm)) {
                                    oldString += `\nDeny: ${value}`
                                }

                                if (newString.length === 0) {
                                    newString = ""
                                }
                                if (oldString.length === 0) {
                                    oldString = ""
                                }

                                Embed.addFields(
                                    {
                                        name: `${OverwriteType[channelPermissions.type]}: ${extra.name} (${extra.id})`,
                                        value: `${newString}\n ${oldString}`
                                    }
                                )
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    }
                })


                Embed.addFields(
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${executor.id}\n[0;35mChannel = ${oldChannel.id}\`\`\``,
                        inline: false
                    }
                )

                await oldChannel.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
            }
        }
    }
});