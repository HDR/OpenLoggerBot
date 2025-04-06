module.exports = {GuildEmojiCreate};
const {client} = require("../constants")
async function GuildEmojiCreate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId} = AuditEntry;
    Embed.setColor('#97ff28');
    Embed.addFields({
        name: '**IDs**',
        value: `\`\`\`ansi\n[0;33mEmoji ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``
    })

    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${target.name}\` (${target.id}) was created`)
    Embed.setThumbnail(target.imageURL())
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}