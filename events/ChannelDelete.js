const {ChannelType} = require("discord.js");
const {client} = require("../constants")
module.exports = {ChannelDelete};
async function ChannelDelete(AuditEntry, Guild, Embed) {
    const {executor, target, createdTimestamp} = AuditEntry;
    Embed.setColor('#ff2828');
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`A channel has been deleted`)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.addFields(
        {
            name: '**Channel Name**',
            value: `${target.name} (${target.id})`,
            inline: true
        },
        {
            name: '**Channel Type**',
            value: `${ChannelType[target.type]}`,
            inline: true
        },
        {
            name: '**Created At**',
            value: `<t:${Math.trunc(createdTimestamp / 1000)}:F>`,
            inline: true
        },
        {
            name: '**IDs**',
            value: `\`\`\`ansi\n[0;33mExecutor ID: ${executor.id}\n[0;35mChannel ID: ${target.id}\`\`\``,
            inline: false
        }
    )
    return Embed;
}