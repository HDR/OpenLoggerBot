# OpenLoggerBot
**An open source Discord logger bot**

## Installation
### Requirements:
- [NodeJS](https://nodejs.org)
- [A Discord Application](https://discord.com/developers/applications)
- [A Pastenbin Account](https://pastebin.com/)

### Setup:
1. `git clone https://github.com/HDR/OpenLoggerBot.git`
2. `cd OpenLoggerBot`
2. Rename `config-example.json` to `config.json` and populate the `token` and `pastebin_key`
3. `npm install`
4. `node index.js`


## Commands
- To get started run `/setchannel <#channel>`
- All events are logged by default, this can be changed via the `/config` command (Example:`/config channelCreate false`)

**Both commands require the manage server permission**

## Permissions
* This section is used to explain why we use certain permissions, Discord seemingly bundles random permissions for no good reason

| Permission           | Purpose                                |
|----------------------|----------------------------------------|
| Manage Server        | Required to log invite usage           |
| View Audit Log       | Required to get data for event logging |
| Read Messages        | Required to view public channels       |
| Send Messages        | Required to post logs                  |
| Embed Links          | Required to embed media                |
| Attach Files         | Required to upload media               |
| Read Message History | Required to read messages              |

## Configuration
<center>

  | Event | Details                                                         |
  |---------------------|-----------------------------------------------------------------|
  | channelCreate       | Triggered when a channel is created                             |
  | channelDelete       | Triggered when a channel is deleted                             |
  | channelUpdate       | Triggered when a channel is updated                             |
  | guildBanAdd         | Triggered when a user is banned                                 |
  | guildBanRemove      | Triggered when a user is unbanned                               |
  | guildEmojiCreate    | Triggered when an emoji is created                              |
  | guildEmojiDelete    | Triggered when an emoji is deleted                              |
  | guildEmojiUpdate    | Triggered when an emoji is updated                              |
  | guildInviteCreate   | Triggered when an invite is created                             |
  | guildMemberAdd      | Triggered when a member joins                                   |
  | guildMemberRemove   | Triggered when a member leaves                                  |
  | guildMemberOnboarding | Triggered when a member clears onboarding                       |
  | guildMemberUpdate   | Triggered when a member is update                               |
  | guildRoleCreate     | Triggered when a role is created                                |
  | guildRoleDelete     | Triggered when a role is deleted                                |
  | guildRoleUpdate     | Triggered when a role is updated                                |
  | guildStickerCreate  | Triggered when a sticker is created                             |
  | guildStickerDelete  | Not Triggered when a sticker is deleted                         |
  | guildStickerUpdate  | Triggered when a sticker is updated                             |
  | guildUpdate         | Triggered when the guild is updated                             |
  | messageBulkDelete   | Triggered when a bot deleted bulk messages or a user is banned  |
  | messageDelete       | Triggered when a message is deleted                             |
  | messageDeleteAttachments | Triggered when a message that has attachments is deleted        |
  | messageUpdate       | Triggered when a message is updated                             |
  | voiceStateUpdate    | Triggered when a  user joins, leaves or moves in a voice channel |
</center>

## Supported Events
* These are the events we can log

| Event                     | State           |
|---------------------------|-----------------|
| AutoModerationRuleCreate  | Not Implemented |
| AutoModerationRuleDelete  | Not Implemented |
| AutoModerationRuleUpdate  | Not Implemented |
| GuildMemberAdd            | Implemented     |
| GuildMemberRemove         | Implemented     |
| GuildMemberUpdate         | Implemented     |
| GuildRoleCreate           | Implemented     |
| GuildRoleDelete           | Implemented     |
| GuildRoleUpdate           | Implemented     |
| GuildEmojiCreate          | Implemented     |
| GuildEmojiDelete          | Implemented     |
| GuildEmojiUpdate          | Implemented     |
| GuildBanAdd               | Implemented     |
| GuildBanRemove            | Implemented     |
| ChannelCreate             | Implemented     |
| ChannelDelete             | Implemented     |
| ChannelUpdate             | Implemented     |
| ChannelPinsUpdate         | Not Implemented |
| MessageCreate             | Implemented     |
| MessageDelete             | Implemented     |
| MessageUpdate             | Implemented     |
| MessageBulkDelete         | Implemented     |
| VoiceStateUpdate          | Implemented     |
| GuildStickerCreate        | Implemented     |
| GuildStickerDelete        | Implemented     |
| GuildStickerUpdate        | Implemented     |
| GuildScheduledEventCreate | Not Implemented |
| GuildScheduledEventUpdate | Not Implemented |
| GuildScheduledEventDelete | Not Implemented |

## Credits

- [Androz2091](https://github.com/Androz2091/) for his [Invite Tracker](https://github.com/Androz2091/discord-invites-tracker)
- [Zipplet](https://github.com/zipplet) for helping me test OpenLoggerBot
- Inspired by [Logger](https://logger.bot/)
