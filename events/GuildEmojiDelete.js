module.exports = {GuildEmojiDelete};
async function GuildEmojiDelete(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mEmoji = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${changes[0].old}\` (${target.id}) was deleted`)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}