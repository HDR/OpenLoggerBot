const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField} = require("discord.js");
const servers = require("../servers.json");
const {getObjectDiffKey} = require("../commonFunctions");

function permissionResolver(permission) {
    const result = [];

    for (const perm of Object.keys(PermissionsBitField.Flags)) {
        if(permission.has(PermissionsBitField.Flags[perm])) {
            result.push(perm);
        }
    }
    return result;
}

client.on(Events.ChannelUpdate, async(OldGuildChannel, NewGuildChannel) => {
    let Embed = new EmbedBuilder()
    Embed.setColor('#97ff28');

    let audit = await OldGuildChannel.guild.fetchAuditLogs({
        limit: 1
    });

    let { executor, changes, extra } = audit.entries.first();

    if (audit.entries.first().action === AuditLogEvent.ChannelUpdate) {
        for (const [key, value] of Object.entries(getObjectDiffKey(OldGuildChannel, NewGuildChannel))) {
            switch (value) {

                default:
                    console.log(value)
                    break;

                case 'topic':
                    Embed.addFields({
                        name: 'Topic',
                        value: `Old Topic: \`${OldGuildChannel.topic}\`\nNew Topic: \`${NewGuildChannel.topic}\``
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


                case 'permissionOverwrites':
                    //Ignore this for now
                    break;
            }
        }
    }

    console.log(changes[0].key)

    if(changes[0].key === "id") {
        if (audit.entries.first().action === AuditLogEvent.ChannelOverwriteCreate || AuditLogEvent.ChannelOverwriteUpdate || AuditLogEvent.ChannelOverwriteDelete) {
            let target;
            let typeString;
            if(extra.name) {
                typeString = `GuildRole`
                target = extra.name
            } else {
                typeString = `User`
                target = `<@${extra.id}>`
            }

            changes.forEach((item, index) => {
                if (changes[0].key === 'id') {
                    if(changes[0].old === undefined && index === 0) {
                        Embed.addFields(
                            {
                                name: `A Permission target was added`,
                                value: `${typeString}: ${target} (${extra.id})`
                            }
                        )
                    }
                    if(changes[0].new === undefined && index === 0){
                        Embed.addFields(
                            {
                                name: `A Permission target was removed`,
                                value: `${typeString}: ${target} (${extra.id})`
                            }
                        )
                    }

                } else {
                    if(index === 0){
                        try {
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
                                    name: `Permissions`,
                                    value: `${newString}\n ${oldString}`
                                }
                            )
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
            })
        }
    }


    Embed.setDescription(`Channel ${NewGuildChannel} (${NewGuildChannel.id}) was updated`)
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mMember = ${audit.entries.first().executorId}\n[0;35mChannel = ${OldGuildChannel.id}\`\`\``,
            inline: false
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    if(servers[OldGuildChannel.guild.id]){await OldGuildChannel.guild.channels.cache.get(servers[OldGuildChannel.guild.id]).send({embeds: [Embed]});}
});