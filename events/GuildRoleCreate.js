module.exports = {GuildRoleCreate};
const {client} = require("../constants")
async function GuildRoleCreate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.setColor('#97ff28');
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`Role \`${target.name}\` (${target.id}) was created`)
    Embed.addFields(
        {
            name: '**Role Name**',
            value: `${target.name}`
        },
        {
            name: '**IDs**',
            value: `\`\`\`ansi\n[0;35mRole ID: ${target.id}\n[0;33mExecutor ID: ${executorId}\`\`\``
        }
    )
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed
}