module.exports = {GuildEmojiUpdate};
async function GuildEmojiUpdate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.setColor('#9854b6');
    Embed.addFields(
        {
            name: 'Name',
            value: `Old Name: \`${changes[0].old}\`\nNew Name: \`${changes[0].new}\``
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mEmoji = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${target.name}\` (${target.id}) was updated`)
    Embed.setThumbnail(target.imageURL())
    return Embed;
}