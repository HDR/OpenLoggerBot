module.exports = {GuildRoleCreate};
async function GuildRoleCreate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.setColor('#97ff28');
    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`Role \`${target.name}\` (${target.id}) was created`)
    Embed.addFields(
        {
            name: 'Name',
            value: `${target.name}`
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mRole = ${target.id}\n[0;34mPerpetrator = ${executorId}\`\`\``
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed
}