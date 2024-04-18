module.exports = {GuildEmojiCreate};
async function GuildEmojiCreate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.addFields({
        name: 'ID',
        value: `\`\`\`ansi\n[0;33mEmoji = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
    })

    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${target.name}\` (${target.id}) was created`)
    Embed.setThumbnail(target.imageURL())
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}