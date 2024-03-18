const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildStickerDelete, async (GuildSticker ) => {

    const audit = await GuildSticker.guild.fetchAuditLogs({
        type: AuditLogEvent.StickerDelete,
        limit: 1,
    });

    let Embed = new EmbedBuilder()
    Embed.addFields(
        {
            name: 'Name',
            value: `${GuildSticker.name}`
        },
        {
            name: 'Tag',
            value: `${GuildSticker.tags}`
        }

    )

    if(GuildSticker.description.length > 0){
        Embed.addFields(
            {
                name: 'Description',
                value: `${GuildSticker.description}`
            },
        )
    }

    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mSticker = ${GuildSticker.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Sticker \`${GuildSticker.name}\` (${GuildSticker.id}) was deleted`)
    Embed.setThumbnail(GuildSticker.url)
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    GuildSticker.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})