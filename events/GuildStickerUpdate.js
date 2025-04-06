const {client} = require("../constants");
module.exports = {GuildStickerUpdate};
async function GuildStickerUpdate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    for (const [key, value] of Object.entries(changes)) {
        switch(value.key) {
            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${value.old}\`\nNew Name: \`${value.new}\``
                })
                break;

            case 'tags':
                let OldTag = ''
                let NewTag = ''
                if(value.old.length > 8){
                    OldTag = `<:emoji:${value.old}>`
                } else {
                    OldTag = value.old
                }
                if(value.new.length > 8){
                    NewTag = `<:emoji:${value.new}>`
                } else {
                    NewTag = value.new
                }
                Embed.addFields({
                    name: 'Tag',
                    value: `Old Tag: ${OldTag}\nNew Tag: ${NewTag}`
                })
                break;

            case 'description':
                Embed.addFields({
                    name: 'Description',
                    value: `Old Description: \`${target.description}\`\nNew Description: \`${target.description}\``
                })
                break;
        }
    }

    Embed.addFields({
        name: '**IDs**',
        value: `\`\`\`ansi\n[0;33mSticker = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
    })
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`Sticker \`${target.name}\` (${target.id}) was updated`)
    Embed.setThumbnail(target.url)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}