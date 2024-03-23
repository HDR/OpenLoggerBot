const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField, Collection} = require("discord.js");
const {getObjectDiffKey, isStringEmpty, tableExists, eventState} = require("../commonFunctions");
const {ChannelType} = require("discord-api-types/v10");

client.on(Events.ChannelUpdate, async(OldGuildChannel, NewGuildChannel) => {
    if (await tableExists(NewGuildChannel.guildId)) {
        if(await eventState(NewGuildChannel.guildId, 'channelUpdate')) {
            let Embed = new EmbedBuilder()
            Embed.setColor('#97ff28');

            let audit = await NewGuildChannel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelUpdate
            });

            let auditLog = await NewGuildChannel.guild.fetchAuditLogs({
                limit: 1,
            });

            let { executor, changes } = auditLog.entries.first();

            if (audit.entries.first().action === AuditLogEvent.ChannelUpdate) {
                for (const [key, value] of Object.entries(getObjectDiffKey(OldGuildChannel, NewGuildChannel))) {
                    switch (value) {

                        default:
                            console.log(value)
                            break;

                        case 'topic':
                            Embed.addFields({
                                name: 'Topic',
                                value: `Old Topic: \`${isStringEmpty(OldGuildChannel.topic)}\`\nNew Topic: \`${isStringEmpty(NewGuildChannel.topic)}\``
                            })
                            break;

                        case 'nsfw':
                            Embed.addFields({
                                name: 'NSFW',
                                value: `Old State: \`${OldGuildChannel.nsfw}\`\nNew State: \`${NewGuildChannel.nsfw}\``
                            })
                            break;

                        case 'rateLimitPerUser':
                            Embed.addFields({
                                name: 'Slowmode',
                                value: `Old Rate Limit: \`${OldGuildChannel.rateLimitPerUser}\`\nNew Rate Limit: \`${NewGuildChannel.rateLimitPerUser}\``
                            })
                            break;

                        case 'defaultAutoArchiveDuration':
                            Embed.addFields({
                                name: 'Thread auto hide interval',
                                value: `Old Interval: \`${OldGuildChannel.defaultAutoArchiveDuration}\`\nNew Interval: \`${NewGuildChannel.defaultAutoArchiveDuration}\``
                            })
                            break;

                        case 'availableTags':
                            let oldTags = new Collection();
                            OldGuildChannel.availableTags.forEach(function(tag) {
                                if(tag.emoji.name){
                                    oldTags.set(tag.emoji.name)
                                } else {
                                    oldTags.set(`<:emoji:${tag.emoji.id}>`)
                                }
                            })
                            let newTags = new Collection();
                            NewGuildChannel.availableTags.forEach(function(tag) {
                                if(tag.emoji.name){
                                    newTags.set(tag.emoji.name)
                                } else {
                                    newTags.set(`<:emoji:${tag.emoji.id}>`)
                                }
                            })
                            Embed.addFields({
                                name: 'Tags',
                                value: `Old Tags: ${Array.from(oldTags.keys()).toString().replaceAll(',', ' ')}\nNew Tags: ${Array.from(newTags.keys()).toString().replaceAll(',', ' ')}`
                            })
                            break;

                        case 'defaultThreadRateLimitPerUser':
                            Embed.addFields({
                                name: 'Thread Rate Limit',
                                value: `Old Rate Limit: \`${OldGuildChannel.rateLimitPerUser}\`\nNew Rate Limit: \`${NewGuildChannel.rateLimitPerUser}\``
                            })
                            break;

                        case 'defaultForumLayout':
                            let defForumLay = ['Default', 'List View', 'Gallery View']
                            Embed.addFields({
                                name: 'Default Forum Layout',
                                value: `Old Forum Layout: \`${defForumLay[OldGuildChannel.defaultForumLayout]}\`\nNew Forum Layout: \`${defForumLay[NewGuildChannel.defaultForumLayout]}\``
                            })
                            break;

                        case 'defaultReactionEmoji':
                            let oldReactEmoji = ''
                            let newReactEmoji = ''
                            if(OldGuildChannel.defaultReactionEmoji.name){
                                oldReactEmoji = OldGuildChannel.defaultReactionEmoji.name
                            } else {
                                oldReactEmoji = `<:emoji:${OldGuildChannel.defaultReactionEmoji.id}>`
                            }
                            if(NewGuildChannel.defaultReactionEmoji.name){
                                newReactEmoji = NewGuildChannel.defaultReactionEmoji.name
                            } else {
                                newReactEmoji = `<:emoji:${NewGuildChannel.defaultReactionEmoji.id}>`
                            }
                            Embed.addFields({
                                name: 'Default Reaction Emoji',
                                value: `Old Reaction Emoji: ${oldReactEmoji}\nNew Reaction Emoji: ${newReactEmoji}`
                            })
                            break;

                        case 'defaultSortOrder':
                            let defSortOrder = ['Recent Activity', 'Creation Time']
                            Embed.addFields({
                                name: 'Default Sort Order',
                                value: `Old Sort Order: \`${defSortOrder[OldGuildChannel.defaultSortOrder]}\`\nNew Sort Order: \`${defSortOrder[NewGuildChannel.defaultSortOrder]}\``
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
            }

            if(changes[0]) {
                if(changes[0].key === "id" || changes[0].key === "allow" || changes[0].key === "deny") {
                    if (auditLog.entries.first().action === AuditLogEvent.ChannelOverwriteCreate || AuditLogEvent.ChannelOverwriteUpdate || AuditLogEvent.ChannelOverwriteDelete) {
                        let target;
                        let typeString;
                        let {extra} = auditLog.entries.first();

                        let APerms = []
                        let DPerms = []

                        changes.forEach((item, index) => {
                            switch (changes[index].key) {
                                case 'allow':
                                    APerms = (new PermissionsBitField(item.new).toArray()).filter(x => !(new PermissionsBitField(item.old).toArray()).includes(x));
                                    break;

                                case 'deny':
                                    DPerms = (new PermissionsBitField(item.new).toArray()).filter(x => !(new PermissionsBitField(item.old).toArray()).includes(x));
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
                    }
                }
            }

            if(Embed.data.fields && Embed.data.fields.length >= 1) {
                Embed.setDescription(`${ChannelType[NewGuildChannel.type]} ${NewGuildChannel} (${NewGuildChannel.id}) was updated`)
                Embed.addFields(
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${audit.entries.first().executorId}\n[0;35mChannel = ${NewGuildChannel.id}\`\`\``,
                        inline: false
                    }
                )

                Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
                Embed.setTimestamp()
                Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})

                try {
                    await NewGuildChannel.guild.channels.cache.get(await eventState(NewGuildChannel.guildId, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = NewGuildChannel.guild
                    console.log(e)
                }
            }
        }
    }
});