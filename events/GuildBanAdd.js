module.exports = {GuildBanAdd};
async function GuildBanAdd(AuditEntry, Guild, Embed) {
    const {executor, target, reason, executorId} = AuditEntry;
    Embed.setAuthor({name: `${target.tag}`, iconURL: `${target.displayAvatarURL()}`})
    Embed.setDescription(`**${target.tag}** was banned`)
    Embed.setColor('#ff2828');
    Embed.addFields(
        {
            name: '**User Information**',
            value: `${target.tag} (${target.id}) <@${target.id}>`
        },
        {
            name: '**Reason**',
            value: `${reason}`
        },
        {
            name: '**ID**',
            value: `\`\`\`ansi\n[0;33mMember ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}