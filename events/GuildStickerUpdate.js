const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const {getObjectDiffKey, tableExists, eventState} = require("../commonFunctions");

client.on(Events.GuildStickerUpdate, async (OldGuildSticker, NewGuildSticker ) => {
    if (await tableExists(NewGuildSticker.guildId)) {
        if(await eventState(NewGuildSticker.guildId, 'guildStickerUpdate')) {
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
                        let OldTag = ''
                        let NewTag = ''
                        if(OldGuildSticker.tags.length > 8){
                            OldTag = `<:emoji:${OldGuildSticker.tags}>`
                        } else {
                            OldTag = OldGuildSticker.tags
                        }
                        if(NewGuildSticker.tags.length > 8){
                            NewTag = `<:emoji:${NewGuildSticker.tags}>`
                        } else {
                            NewTag = NewGuildSticker.tags
                        }
                        Embed.addFields({
                            name: 'Tag',
                            value: `Old Tag: ${OldTag}\nNew Tag: ${NewTag}`
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
            try {
                await NewGuildSticker.guild.channels.cache.get(await eventState(NewGuildSticker.guildId, 'logChannel')).send({embeds: [Embed]});
            } catch (e) {
                e.guild = NewGuildSticker.guild
                console.log(e)
            }
        }
    }
})