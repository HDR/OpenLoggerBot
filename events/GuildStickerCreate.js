const {client} = require("../constants");
module.exports = {GuildStickerCreate};
async function GuildStickerCreate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.setColor('#97ff28');
    let tag
    if(target.tags.length > 8){
        tag = `<:emoji:${target.tags}>`
    } else {
        tag = target.tags
    }

    Embed.addFields(
        {
            name: '**Sticker Name**',
            value: `${target.name}`,
            inline: true
        },
        {
            name: '**Tag**',
            value: `${tag}`,
            inline: true
        }
    )

    if(target.description.length > 0){
        Embed.addFields({
            name: '**Description**',
            value: `${target.description}`
        })
    }

    Embed.addFields({
        name: '**IDs**',
        value: `\`\`\`ansi\n[0;33mSticker ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``
    })

    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`Sticker \`${target.name}\` (${target.id}) was created`)
    Embed.setThumbnail(target.url)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}