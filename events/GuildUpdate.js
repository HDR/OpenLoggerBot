const {client} = require("../constants");
const {Events, EmbedBuilder, AuditLogEvent, PermissionsBitField } = require("discord.js");
const {log_channel} = require("./config/events.json");
const {getObjectDiffKey, getObjectDiffValue} = require("../commonFunctions");

client.on(Events.GuildUpdate, async (OldGuild, NewGuild) => {
    let Embed = new EmbedBuilder()

    const audit = await OldGuild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.GuildUpdate,
    });


    for (const [key, value] of Object.entries(getObjectDiffKey(OldGuild, NewGuild))) {
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

            case 'widgetChannelId':
                Embed.addFields({
                    name: 'Widget Channel',
                    value: `Old Widget Channel: ${OldGuild.widgetChannel} (${OldGuild.widgetChannelId})\nNew Widget Channel: ${NewGuild.widgetChannel} (${NewGuild.widgetChannelId})`
                })
                break;

            case 'widgetEnabled':
                Embed.addFields({
                    name: 'Widget Settings',
                    value: `Old State: \`${OldGuild.widgetEnabled}\`\nNew State: \`${NewGuild.widgetEnabled}\``
                })
                break;

            case 'explicitContentFilter':
                Embed.addFields({
                    name: 'Explicit image filter',
                    value: `Old State: \`${contentFilter(OldGuild.explicitContentFilter)}\`\nNew State: \`${contentFilter(NewGuild.explicitContentFilter)}\``
                })
                break;

            case 'safetyAlertsChannelId':
                Embed.addFields({
                    name: 'Safety alerts Channel',
                    value: `Old Safety Alerts Channel: ${OldGuild.safetyAlertsChannel} (${OldGuild.safetyAlertsChannelId})\nNew Safety Alerts Channel: ${NewGuild.safetyAlertsChannel} (${NewGuild.safetyAlertsChannelId})`
                })
                break;

            case 'features':
                //This is currently a hot mess, so we leave it alone for now
                break;

            case 'rulesChannelId':
                Embed.addFields({
                    name: 'Rules Channel',
                    value: `Old Rules Channel: ${OldGuild.rulesChannel} (${OldGuild.rulesChannelId})\nNew Rules Channel: ${NewGuild.rulesChannel} (${NewGuild.rulesChannelId})`
                })
                break;

            case 'publicUpdatesChannelId':
                Embed.addFields({
                    name: 'Updates Channel',
                    value: `Old Updates Channel: ${OldGuild.publicUpdatesChannel} (${OldGuild.publicUpdatesChannelId})\nNew Updates Channel: ${NewGuild.publicUpdatesChannel} (${NewGuild.publicUpdatesChannelId})`
                })
                break;

            case 'preferredLocale':
                Embed.addFields({
                    name: 'Preferred Locale',
                    value: `Old Preferred Locale: \`${OldGuild.preferredLocale}\`\nNew Preferred Locale: \`${NewGuild.preferredLocale}\``
                })
                break;

            case 'description':
                Embed.addFields({
                    name: 'Community Description',
                    value: `Old Description: \`${OldGuild.description}\`\nNew Description: \`${NewGuild.description}\``
                })
                break;

            case 'verificationLevel':
                Embed.addFields({
                    name: 'Verification Level',
                    value: `Old Verification Level: \`${verificationLevel(OldGuild.verificationLevel)}\`\nNew Verification Level: \`${verificationLevel(NewGuild.verificationLevel)}\``
                })
                break;

            case 'mfaLevel':
                Embed.addFields({
                    name: 'Moderator 2fa Required',
                    value: `Old State: \`${Boolean(OldGuild.mfaLevel)}\`\nNew State: \`${Boolean(NewGuild.mfaLevel)}\``
                })
                break;

        }
    }


    Embed.setDescription(`Guild \`${NewGuild.name}\` (${NewGuild.id}) was updated`)
    if(!Embed.data.fields){return;}
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

function contentFilter(state) {
    switch (state){
        case 0:
            return 'Do not filter'

        case 1:
            return 'Filter messages from server members without roles'

        case 2:
            return 'Filter messages from all members'
    }
}

function verificationLevel(state) {
    switch (state){
        case 1:
            return 'Low'

        case 2:
            return 'Medium'

        case 3:
            return 'High'

        case 4:
            return 'Highest'
    }
}