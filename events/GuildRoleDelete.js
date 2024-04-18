module.exports = {GuildRoleDelete};
async function GuildRoleDelete(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.setColor('#ff2828');
    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`Role \`${changes[0].old}\` (${target.id}) was deleted`)
    Embed.addFields(
        {
            name: 'Name',
            value: `${changes[0].old}`
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mRole = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}