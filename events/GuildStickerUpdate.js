const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const {getObjectDiffKey} = require("../commonFunctions");
const servers = require("../servers.json");

client.on(Events.GuildStickerUpdate, async (OldGuildSticker, NewGuildSticker ) => {

    let Embed = new EmbedBuilder()
    const audit = await NewGuildSticker.guild.fetchAuditLogs({
        type: AuditLogEvent.StickerUpdate,
        limit: 1,
    });

    for (const [key, value] of Object.entries(getObjectDiffKey(OldGuildSticker, NewGuildSticker))) {
        switch(value) {
            default:
                console.log(value)
                break;

            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${OldGuildSticker.name}\`\nNew Name: \`${NewGuildSticker.name}\``
                })
                break;

            case 'tags':
                Embed.addFields({
                    name: 'Tag',
                    value: `Old Tag: \`${OldGuildSticker.tags}\`\nNew Tag: \`${NewGuildSticker.tags}\``
                })
                break;

            case 'description':
                Embed.addFields({
                    name: 'Description',
                    value: `Old Description: \`${OldGuildSticker.description}\`\nNew Description: \`${NewGuildSticker.description}\``
                })
                break;
        }
    }

    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mSticker = ${NewGuildSticker.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Sticker \`${NewGuildSticker.name}\` (${NewGuildSticker.id}) was updated`)
    Embed.setThumbnail(NewGuildSticker.url)
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    if(servers[NewGuildSticker.guild.id]){await NewGuildSticker.guild.channels.cache.get(servers[NewGuildSticker.guild.id]).send({embeds: [Embed]});}
})