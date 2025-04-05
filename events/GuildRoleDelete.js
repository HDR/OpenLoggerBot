const {client} = require("../constants");
module.exports = {GuildRoleDelete};
async function GuildRoleDelete(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.setColor('#ff2828');
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`Role \`${changes[0].old}\` (${target.id}) was deleted`)
    Embed.addFields(
        {
            name: '**Role Name**',
            value: `${changes[0].old}`
        },
        {
            name: '**ID**',
            value: `\`\`\`ansi\n[0;33mRole ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}