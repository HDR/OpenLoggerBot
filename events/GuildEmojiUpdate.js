const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")
const {getObjectDiff} = require("../commonFunctions");

client.on(Events.GuildEmojiUpdate, async (OldGuildEmoji, NewGuildEmoji) => {

    let Embed = new EmbedBuilder()

    const audit = await OldGuildEmoji.guild.fetchAuditLogs({
        type: AuditLogEvent.EmojiUpdate,
        limit: 1,
    });

    for (const [key, value] of Object.entries(getObjectDiff(OldGuildEmoji, NewGuildEmoji))) {
        switch(value) {
            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${OldGuildEmoji.name}\`\nNew Name: \`${NewGuildEmoji.name}\``
                })
                break;
        }
    }

    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mEmoji = ${NewGuildEmoji.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${NewGuildEmoji.name}\` (${NewGuildEmoji.id}) was created`)
    Embed.setThumbnail(NewGuildEmoji.imageURL())
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    OldGuildEmoji.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})