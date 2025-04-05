module.exports = {GuildBanRemove};
async function GuildBanRemove(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.setAuthor({name: `${target.tag}`, iconURL: `${target.displayAvatarURL()}`})
    Embed.setDescription(`**${target.tag}** was unbanned`)
    Embed.setColor('#97ff28');
    Embed.addFields(
        {
            name: '**User Information**',
            value: `${target.tag} (${target.id}) <@${target.id}>`
        },
        {
            name: '**ID**',
            value: `\`\`\`ansi\n[0;33mMember ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}