const {client} = require("../constants");
const {AuditLogEvent, EmbedBuilder, Events} = require('discord.js');
const servers = require("../servers.json");


client.on(Events.GuildBanAdd, async (GuildBan) => {

    const audit = await GuildBan.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1,
    });

    let Embed = new EmbedBuilder()
    Embed.setAuthor({name: `${GuildBan.user.tag}`, iconURL: `${GuildBan.user.displayAvatarURL()}`})
    Embed.setDescription(`**${GuildBan.user.tag}** was banned`)
    Embed.addFields(
        {
            name: 'User Information',
            value: `${GuildBan.user.tag} (${GuildBan.user.id}) <@${GuildBan.user.id}>`
        },
        {
            name: 'Reason',
            value: `${audit.entries.first().reason}`
        },
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mMember = ${GuildBan.user.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    if(servers[GuildBan.guild.id]){await GuildBan.guild.channels.cache.get(servers[GuildBan.guild.id]).send({embeds: [Embed]});}
})