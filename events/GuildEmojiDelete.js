const {client} = require("../constants");
module.exports = {GuildEmojiDelete};
async function GuildEmojiDelete(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    Embed.setColor('#ff2828');
    Embed.addFields({
        name: '**IDs**',
        value: `\`\`\`ansi\n[0;31mEmoji ID: ${target.id}\n[0;33mExecutor ID: ${executorId}\`\`\``
    })
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`😞 Emoji \`${changes[0].old}\` (${target.id}) was deleted`)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}