const {ChannelType} = require("discord.js");
const {client} = require("../constants")
module.exports = {ChannelCreate};
async function ChannelCreate(AuditEntry, Guild, Embed) {
    const {executor, target} = AuditEntry;
    Embed.setColor('#97ff28');
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setDescription(`A channel has been created`)
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.addFields(
        {
            name: '**Channel Name**',
            value: `${target.name} (${target.id})`,
            inline: true
        },
        {
            name: '**Channel Type**',
            value:  `${ChannelType[target.type]}`,
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