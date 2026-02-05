  # OpenLoggerBot
**An open source Discord logger bot**

## External Tools
[.log file viewer for OpenLoggerBot](https://martinrefseth.com/olb/logview/)

# Installation
---
## Docker:

#### Requirements:
- [Docker(duh)](https://www.docker.com/get-started/)

### Setup:
1. `docker pull ghcr.io/hdr/openloggerbot:docker`
2. `docker run --name OpenLoggerBot -e DISCORD_TOKEN=YOUR_TOKEN_HERE -v /home/docker/olb/.data:/app/.data ghcr.io/hdr/openloggerbot:docker`

### Updating:
1. `docker pull ghcr.io/hdr/openloggerbot:docker`
2. `docker stop OpenLoggerBot`
3. `docker rm OpenLoggerBot`
4. `docker run --name OpenLoggerBot -e DISCORD_TOKEN=YOUR_TOKEN_HERE -v /home/docker/olb/.data:/app/.data ghcr.io/hdr/openloggerbot:docker`

---
## Manual: 
### Requirements:
- [NodeJS](https://nodejs.org)
- [A Discord Application](https://discord.com/developers/applications)

### Setup:
1. `git clone https://github.com/HDR/OpenLoggerBot.git`
2. `cd OpenLoggerBot`
2. Rename `.env.example` to `.env` and add your discord token after `DISCORD_TOKEN=`
3. `npm install`
4. `node index.js`


---

## Commands
- To get started run `/setchannel <#channel>`
- All events are logged by default, this can be changed via the `/config` command 

**Example Usage:**
- `/config channelCreate false` (This would cause the bot to stop logging channelCreate events)

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
| Attach Files         | Required to log bulk deleted messages  |
| Read Message History | Required to read messages              |

## Configuration
- Usage:
    `/config <eventName> <true/false>`
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

