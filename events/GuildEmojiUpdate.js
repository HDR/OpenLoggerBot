const {client} = require("../constants");
module.exports = {GuildEmojiUpdate};
async function GuildEmojiUpdate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.setColor('#9854b6');
    Embed.addFields(
        {
            name: '**Old Name**',
            value: `${changes[0].old}`,
            inline: true
        },
        {
            name: '**New Name**',
            value: `${changes[0].new}`,
            inline: true
        },
        {
            name: '**ID**',
            value: `\`\`\`ansi\n[0;33mEmoji ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``,
            inline: false
        }
    )

    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${target.name}\` (${target.id}) was updated`)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setThumbnail(target.imageURL())
    return Embed;
}