const {ChannelType} = require("discord.js");
module.exports = {ChannelDelete};
async function ChannelDelete(AuditEntry, Guild, Embed) {
    const {executor, target, createdTimestamp} = AuditEntry;
    Embed.setColor('#ff2828');
    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`${executor.tag} deleted a channel`)
    Embed.addFields(
        {
            name: 'Name',
            value: `${target.name} (${target.id})`
        },
        {
            name: 'Created At',
            value: `<t:${Math.trunc(createdTimestamp / 1000)}:F>`
        },
        {
            name: 'Type',
            value: `${ChannelType[target.type]}`,
            inline: false
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mMember = ${executor.id}\n[0;35mChannel = ${target.id}\`\`\``,
            inline: false
        }
    )
    return Embed;
}