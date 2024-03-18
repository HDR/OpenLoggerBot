const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField } = require("discord.js");
const {log_channel} = require("./config/events.json");
const {getObjectDiff} = require("../commonFunctions");

client.on(Events.GuildUpdate, async (OldGuild, NewGuild) => {
    let Embed = new EmbedBuilder()

    const audit = await OldGuild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.GuildUpdate,
    });


    for (const [key, value] of Object.entries(getObjectDiff(OldGuild, NewGuild))) {
        switch (value) {
            default:
                console.log(value)
                break;
            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${OldGuild.name}\`\nNew Name: \`${NewGuild.name}\``
                })
                break;

            case 'afkTimeout':
                Embed.addFields({
                    name: 'AFK Timeout',
                    value: `Old Timeout: \`${OldGuild.afkTimeout}\`\nNew Timeout: \`${NewGuild.afkTimeout}\``
                })
                break;

            case 'afkChannelId':
                Embed.addFields({
                    name: 'AFK Channel',
                    value: `Old Afk Channel: ${OldGuild.afkChannel} (${OldGuild.afkChannelId})\nNew Afk Channel: ${NewGuild.afkChannel} (${NewGuild.afkChannelId})`
                })
                break;

            case 'premiumProgressBarEnabled':
                Embed.addFields({
                    name: 'Boost Progress Bar',
                    value: `Old State: \`${OldGuild.premiumProgressBarEnabled}\`\nNew State: \`${NewGuild.premiumProgressBarEnabled}\``
                })
                break;

            case 'systemChannelId':
                Embed.addFields({
                    name: 'System Channel',
                    value: `Old System Channel: ${OldGuild.systemChannel} (${OldGuild.systemChannelId})\nNew System Channel: ${NewGuild.systemChannel} (${NewGuild.systemChannelId})`
                })
                break;

            case 'systemChannelFlags':
                Embed.addFields({
                    name: 'System Channel Flags',
                    value: `Old State:\n\`${OldGuild.systemChannelFlags.toArray().toString().replaceAll(',','\n')}\`\nNew State:\n\`${NewGuild.systemChannelFlags.toArray().toString().replaceAll(',','\n')}\``
                })
                break;

            case 'defaultMessageNotifications':
                Embed.addFields({
                    name: 'Notification Settings',
                    value: `Old State: \`${notificationState(OldGuild.defaultMessageNotifications)}\`\nNew State: \`${notificationState(NewGuild.defaultMessageNotifications)}\``
                })
                break;

            case 'icon':
                Embed.addFields({
                    name: 'Icon',
                    value: `Old Server Icon: \`${OldGuild.iconURL()}\`\nNew Server Icon: \`${NewGuild.iconURL()}\``
                })
                break;

            case 'banner':
                Embed.addFields({
                    name: 'Icon',
                    value: `Old Server Banner: \`${OldGuild.bannerURL()}\`\nNew Server Banner: \`${NewGuild.bannerURL()}\``
                })
                break;

            case 'splash':
                Embed.addFields({
                    name: 'Icon',
                    value: `Old Splash Background: \`${OldGuild.splashURL()}\`\nNew Splash Banner: \`${NewGuild.splashURL()}\``
                })
                break;
        }
    }


    Embed.setDescription(`Guild \`${NewGuild.name}\` (${NewGuild.id}) was updated`)
    Embed.addFields(
        {
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mGuild = ${OldGuild.id}\n[0;34mPerpetrator = ${audit.entries.first().executorId}\`\`\``
        }
    )

    Embed.setAuthor({name: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    Embed.setTimestamp()
    Embed.setFooter({text: `${audit.entries.first().executor.tag}`, iconURL: `${audit.entries.first().executor.displayAvatarURL()}`})
    OldGuild.channels.cache.get(log_channel).send({embeds: [Embed]});
})

function notificationState(state) {
    switch (state){
        case 0:
            return 'All Messages'

        case 1:
            return 'Only @mentions'
    }
}