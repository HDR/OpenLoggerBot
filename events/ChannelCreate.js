const {ChannelType} = require("discord.js");
module.exports = {ChannelCreate};
async function ChannelCreate(AuditEntry, Guild, Embed) {
    const {executor, target} = AuditEntry;
    Embed.setColor('#97ff28');
    Embed.setAuthor({name: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    Embed.setDescription(`${executor.tag} created a channel`)
    Embed.addFields(
        {
            name: 'Name',
            value: `${target.name} (${target.id})`
        },
        {
            name: 'Type',
            value:  `${ChannelType[target.type]}`,
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