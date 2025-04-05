const {SystemChannelFlagsBitField} = require("discord.js");
const {client} = require("../constants");
module.exports = {GuildUpdate};
async function GuildUpdate(AuditEntry, Guild, Embed) {
    const {executor, target, executorId, changes} = AuditEntry;
    for (const [key, value] of Object.entries(changes)) {
        switch (value.key) {
            default:
                console.log(value)
                break;
            case 'name':
                Embed.addFields({
                    name: 'Name',
                    value: `Old Name: \`${value.old}\`\nNew Name: \`${value.new}\``
                })
                break;

            case 'afk_timeout':
                Embed.addFields({
                    name: 'AFK Timeout',
                    value: `Old Timeout: \`${value.old}\`\nNew Timeout: \`${value.new}\``
                })
                break;

            case 'afk_channel_id':
                Embed.addFields({
                    name: 'AFK Channel',
                    value: `Old Afk Channel: <@&${value.old}> (${value.old})\nNew Afk Channel: <@&${value.new}> (${value.new})`
                })
                break;

            case 'premium_progress_bar_enabled':
                Embed.addFields({
                    name: 'Boost Progress Bar',
                    value: `Old State: \`${value.old}\`\nNew State: \`${value.new}\``
                })
                break;

            case 'system_channel_id':
                Embed.addFields({
                    name: 'System Channel',
                    value: `Old System Channel: <@&${value.old}> (${value.old})\nNew System Channel: <@&${value.new}> (${value.new})`
                })
                break;

            case 'system_channel_flags':
                Embed.addFields({
                    name: 'System Channel Flags',
                    value: `Old State:\n\`${new SystemChannelFlagsBitField(String(value.old)).toArray().toString().replaceAll(',','\n')}\`\nNew State:\n\`${new SystemChannelFlagsBitField(String(value.new)).toArray().toString().replaceAll(',','\n')}\``
                })
                break;

            case 'default_message_notifications':
                const notificationState = ['All Messages', 'Only @mentions']
                Embed.addFields({
                    name: 'Notification Settings',
                    value: `Old State: \`${notificationState[value.old]}\`\nNew State: \`${notificationState[value.new]}\``
                })
                break;

            case 'icon':
                Embed.addFields({
                    name: 'Icon',
                    value: `Old Server Icon: \`${value.old}\`\nNew Server Icon: \`${value.new}\``
                })
                break;

            case 'banner':
                Embed.addFields({
                    name: 'Icon',
                    value: `Old Server Banner: \`${value.old}\`\nNew Server Banner: \`${value.new}\``
                })
                break;

            case 'splash':
                Embed.addFields({
                    name: 'Icon',
                    value: `Old Splash Background: \`${value.old}\`\nNew Splash Banner: \`${value.new}\``
                })
                break;

            case 'widget_channel_id':
                Embed.addFields({
                    name: 'Widget Channel',
                    value: `Old Widget Channel: <@&${value.old}> (${value.old})\nNew Widget Channel: <@&${value.new}> (${value.new})`
                })
                break;

            case 'widget_enabled':
                Embed.addFields({
                    name: 'Widget Settings',
                    value: `Old State: \`${value.old}\`\nNew State: \`${value.new}\``
                })
                break;

            case 'explicit_content_filter':
                const contentFilter = ['Do not filter', 'Filter messages from server members without roles', 'Filter messages from all members']
                Embed.addFields({
                    name: 'Explicit image filter',
                    value: `Old State: \`${contentFilter[value.old]}\`\nNew State: \`${contentFilter[value.new]}\``
                })
                break;

            case 'safety_alerts_channel_id':
                Embed.addFields({
                    name: 'Safety alerts Channel',
                    value: `Old Safety Alerts Channel: <@&${value.old}> (${value.old})\nNew Safety Alerts Channel: <@&${value.new}> (${value.new})`
                })
                break;

            case 'features':
                //This is currently a hot mess, so we leave it alone for now
                break;

            case 'rules_channel_id':
                Embed.addFields({
                    name: 'Rules Channel',
                    value: `Old Rules Channel: <@&${value.old}> (${value.old})\nNew Rules Channel: <@&${value.new}> (${value.new})`
                })
                break;

            case 'public_updates_channel_id':
                Embed.addFields({
                    name: 'Updates Channel',
                    value: `Old Updates Channel: <@&${value.old}> (${value.old})\nNew Updates Channel: <@&${value.new}> (${value.new})`
                })
                break;

            case 'preferred_locale':
                Embed.addFields({
                    name: 'Preferred Locale',
                    value: `Old Preferred Locale: \`${value.old}\`\nNew Preferred Locale: \`${value.new}\``
                })
                break;

            case 'description':
                Embed.addFields({
                    name: 'Community Description',
                    value: `Old Description: \`${value.old ?? "None"}\`\nNew Description: \`${value.new ?? "None"}\``
                })
                break;

            case 'verification_level':
                const verificationLevel = ['Low', 'Medium', 'High', 'Highest']
                Embed.addFields({
                    name: 'Verification Level',
                    value: `Old Verification Level: \`${verificationLevel[value.old]}\`\nNew Verification Level: \`${verificationLevel[value.new]}\``
                })
                break;

            case 'mfa_level':
                Embed.addFields({
                    name: 'Moderator 2fa Required',
                    value: `Old State: \`${Boolean(value.new)}\`\nNew State: \`${Boolean(value.new)}\``
                })
                break;

        }
    }


    Embed.setDescription(`Guild \`${target.name}\` (${target.id}) was updated`)
    if(!Embed.data.fields){return;}
    Embed.addFields({
        name: '**ID**',
        value: `\`\`\`ansi\n[0;33mGuild ID: ${target.id}\n[0;34mExecutor ID: ${executorId}\`\`\``
    })
    Embed.setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    Embed.setFooter({text: `${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`})
    return Embed;
}