const {AuditLogEvent, PermissionsBitField, Collection, ChannelType} = require("discord.js");
const {client} = require("../constants")
module.exports = {ChannelUpdate};
async function ChannelUpdate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes, action, extra} = AuditEntry;
    Embed.setColor('#9854b6');
    switch(action) {
        case AuditLogEvent.ChannelUpdate:
            for (const [key, value] of Object.entries(changes)) {
                switch (value.key) {
                    default:
                        console.log(value.key)
                        break;

                    case 'name':
                        Embed.addFields(
                            {
                                name: 'Old Name',
                                value: `\`${value.old ?? "None"}\``,
                                inline: true
                            },
                            {
                                name: 'New Name',
                                value: `\`${value.new ?? "None"}\``,
                                inline: true
                            }
                        )
                        break;

                    case 'topic':
                        Embed.addFields(
                    {
                            name: 'Old Topic',
                            value: `\`${value.old ?? "None"}\``,
                        },
                        {
                            name: 'New Topic',
                            value: `\`${value.new ?? "None"}\``
                        })
                        break;

                    case 'nsfw':
                        Embed.addFields({
                            name: 'NSFW',
                            value: `Old State: \`${value.old}\`\nNew State: \`${value.new}\``
                        })
                        break;

                    case 'rate_limit_per_user':
                        Embed.addFields({
                            name: 'Slowmode',
                            value: `Old Rate Limit: \`${value.old}\`\nNew Rate Limit: \`${value.new}\``
                        })
                        break;

                    case 'default_auto_archive_duration':
                        Embed.addFields({
                            name: 'Thread auto hide interval',
                            value: `Old Interval: \`${value.old}\`\nNew Interval: \`${value.new}\``
                        })
                        break;

                    case 'available_tags':
                        let oldTags = new Collection();
                        value.old.forEach(function(tag) {
                            if(tag.emoji_name){
                                oldTags.set(tag.emoji_name)
                            } else {
                                oldTags.set(`<:emoji:${tag.id}>`)
                            }
                        })
                        let newTags = new Collection();
                        value.new.forEach(function(tag) {
                            if(tag.emoji_name){
                                newTags.set(tag.emoji_name)
                            } else {
                                newTags.set(`<:emoji:${tag.id}>`)
                            }
                        })
                        Embed.addFields({
                            name: 'Tags',
                            value: `Old Tags: ${Array.from(oldTags.keys()).toString().replaceAll(',', ' ')}\nNew Tags: ${Array.from(newTags.keys()).toString().replaceAll(',', ' ')}`
                        })
                        break;

                    case 'default_thread_rate_limit_per_user':
                        Embed.addFields({
                            name: 'Thread Rate Limit',
                            value: `Old Rate Limit: \`${value.old}\`\nNew Rate Limit: \`${value.new}\``
                        })
                        break;

                    case 'default_forum_layout':
                        let defForumLay = ['Default', 'List View', 'Gallery View']
                        Embed.addFields({
                            name: 'Default Forum Layout',
                            value: `Old Forum Layout: \`${defForumLay[value.old]}\`\nNew Forum Layout: \`${defForumLay[value.new]}\``
                        })
                        break;

                    case 'default_reaction_emoji':
                        let oldReactEmoji = ''
                        let newReactEmoji = ''
                        if(value.old.emoji_name){
                            oldReactEmoji = value.old.emoji_name
                        } else {
                            oldReactEmoji = `<:emoji:${value.old.emoji_id}>`
                        }
                        if(value.old.emoji_name){
                            newReactEmoji = value.old.emoji_name
                        } else {
                            newReactEmoji = `<:emoji:${value.new.emoji_id}>`
                        }
                        Embed.addFields({
                            name: 'Default Reaction Emoji',
                            value: `Old Reaction Emoji: ${oldReactEmoji}\nNew Reaction Emoji: ${newReactEmoji}`
                        })
                        break;

                    case 'default_sort_order':
                        let defSortOrder = ['Recent Activity', 'Creation Time']
                        Embed.addFields({
                            name: 'Default Sort Order',
                            value: `Old Sort Order: \`${defSortOrder[value.old]}\`\nNew Sort Order: \`${defSortOrder[value.new]}\``
                        })
                        break;

                    case 'rawPosition':
                        //Ignore otherwise we will just have a bunch of spam
                        break;

                    case 'permissionOverwrites':
                        //Ignore this for now
                        break;
                }
            }
            break;

        case AuditLogEvent.ChannelOverwriteCreate:
        case AuditLogEvent.ChannelOverwriteDelete:
        case AuditLogEvent.ChannelOverwriteUpdate:
            let target;
            let typeString;

            let APerms = []
            let DPerms = []

            changes.forEach((item, index) => {
                switch (changes[index].key) {
                    case 'allow':
                        if(item.new === undefined) {item.new = '0'}
                        APerms = (new PermissionsBitField(String(item.new)).toArray()).filter(x => !(new PermissionsBitField(String(item.old)).toArray()).includes(x));
                        break;

                    case 'deny':
                        if(item.new === undefined) {item.new = '0'}
                        DPerms = (new PermissionsBitField(String(item.new)).toArray()).filter(x => !(new PermissionsBitField(String(item.old)).toArray()).includes(x));
                        break;

                    case 'id':
                        if (changes[index].old === undefined && index === 0) {
                            if (!extra.type) {
                                typeString = `Role`
                                target = `<@&${extra.id}>`
                                Embed.addFields({
                                    name: `Role`,
                                    value: `<@&${extra.id}> (${extra.id}) was added`
                                })
                            } else {
                                typeString = `User`
                                target = `<@${extra.id}>`
                                Embed.addFields({
                                    name: `User`,
                                    value: `<@${extra.id}> (${extra.id}) was added`
                                })
                            }
                        }
                        if (changes[index].new === undefined && index === 0) {
                            if (!extra.type) {
                                typeString = `Role`
                                target = `<@&${extra.id}>`
                                Embed.addFields({
                                    name: `Role`,
                                    value: `<@&${extra.id}> (${extra.id}) was removed`
                                })
                            } else {
                                typeString = `User`
                                target = `<@${extra.id}>`
                                Embed.addFields({
                                    name: `User`,
                                    value: `<@${extra.id}> (${extra.id}) was removed`
                                })
                            }
                        }
                        break;
                }
            })

            if(changes.length <= 3) {
                let targetVal = `<@${extra.id}> (${extra.id})`
                if(extra.name){extra.type = 0; targetVal = `<@&${extra.id}> (${extra.id})`}
                let targetType = ['Role', 'User']
                Embed.addFields({
                    name: targetType[extra.type],
                    value: targetVal
                })
            }

            let permString = '';
            if (APerms.length > 0) {
                permString += `**Allowed** ${APerms.toString().replaceAll(",", "\n**Allowed** ")}\n\n`
            }
            if (DPerms.length > 0) {
                permString += `**Denied** ${DPerms.toString().replaceAll(",", "\n**Denied** ")}`
            }

            if (permString.length > 0) {
                Embed.addFields({
                    name: 'Permission Changes',
                    value: `${permString}`
                })
            }
            break;
    }

    Embed.setDescription(`🔄 ${ChannelType[target.type]} ${target} (${target.id}) was updated`)
    Embed.addFields(
        {
            name: '**IDs**',
            value: `\`\`\`ansi\n[0;33mExecutor ID: ${executorId}\n[0;35mChannel ID: ${target.id}\`\`\``,
            inline: false
        }
    )

    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}
