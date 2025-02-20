module.exports = {GuildStickerDelete};
async function GuildStickerDelete(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.setColor('#ff2828');
    let tag
    if(target.tags.length > 8){
        tag = `<:emoji:${target.tags}>`
    } else {
        tag = target.tags
    }

    Embed.addFields(
        {
            name: 'Name',
            value: `${target.name}`,
            inline: true
        },
        {
            name: 'Tag',
            value: `${tag}`,
            inline: true
        }
    )

    Embed.addFields({
        name: 'Description',
        value: target?.description?.trim() || 'No description provided'
    })

    Embed.addFields({
        name: 'ID',
        value: `\`\`\`ansi\n[0;33mSticker = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
    })

    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`Sticker \`${target.name}\` (${target.id}) was deleted`)
    Embed.setThumbnail(target.url)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}