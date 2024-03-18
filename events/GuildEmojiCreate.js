const {client} = require("../constants");
const {Events, AuditLogEvent, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")

client.on(Events.GuildEmojiCreate, async (GuildEmoji ) => {

    const audit = await GuildEmoji.guild.fetchAuditLogs({
        type: AuditLogEvent.EmojiCreate,
        limit: 1,
    });

    console.log(audit.entries.first())

    let Embed = new EmbedBuilder()
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mEmoji = ${GuildEmoji.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setDescription(`Emoji \`${GuildEmoji.name}\` (${GuildEmoji.id}) was created`)
    Embed.setThumbnail(GuildEmoji.imageURL())
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    GuildEmoji.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
})