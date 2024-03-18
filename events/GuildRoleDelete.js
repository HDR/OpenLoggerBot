const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent} = require("discord.js");
const servers = require("../servers.json");



client.on(Events.GuildRoleDelete, async (Role) => {

    const audit = await Role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete,
    });

    let Embed = new EmbedBuilder()
    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Role \`${Role.name}\` (${Role.id}) was deleted`)
    Embed.addFields(
        {
            name: 'Name',
            value: `${Role.name}`
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mRole = ${Role.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    if(servers[Role.guild.id]){await Role.guild.channels.cache.get(servers[Role.guild.id]).send({embeds: [Embed]});}
})