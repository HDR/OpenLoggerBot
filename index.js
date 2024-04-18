const {client} = require("./constants");
const { Collection, REST, Routes, Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const { token } = require('./config.json')
const fs = require('fs')
const sqlite3 = require("sqlite3");
const {tableExists, eventState} = require("./commonFunctions");
const {ChannelCreate} = require("./events/ChannelCreate");
const {ChannelDelete} = require("./events/ChannelDelete");
const {GuildBanAdd} = require("./events/GuildBanAdd");
const {GuildBanRemove} = require("./events/GuildBanRemove");
const {GuildEmojiCreate} = require("./events/GuildEmojiCreate");
const {GuildEmojiDelete} = require("./events/GuildEmojiDelete");
const {GuildMemberKick} = require("./events/GuildMemberRemove");
const {GuildRoleCreate} = require("./events/GuildRoleCreate");
const {GuildStickerCreate} = require("./events/GuildStickerCreate");
const {GuildStickerDelete} = require("./events/GuildStickerDelete");
const {ChannelUpdate} = require("./events/ChannelUpdate");
const {GuildEmojiUpdate} = require("./events/GuildEmojiUpdate");
const {GuildRoleDelete} = require("./events/GuildRoleDelete");
const {GuildStickerUpdate} = require("./events/GuildStickerUpdate");
const {GuildRoleUpdate} = require("./events/GuildRoleUpdate");
const {GuildUpdate} = require("./events/GuildUpdate");
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

client.commands = new Collection;

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

new sqlite3.Database('./config.db', (err) => {if (err) {console.log(err.message);}});

async function registerCommands(){
    const commandData = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        commandData.push(command.data.toJSON());

    }

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${commandData.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(client.application.id),
                {body: commandData},
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })().then();
}

for (const file of events) {
    require(`./events/${file}`);
}

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }

    if(interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }

});

client.login(token).then(registerCommands);

client.on('ready', async () => {
    client.user.setPresence({ activities: [{ name: `Keeping an eye on events across ${client.guilds.cache.size} servers` }] });
})

//Handle Audit log events
client.on(Events.GuildAuditLogEntryCreate, async (AuditEntry, Guild) => {
    if (await tableExists(Guild.id)) {
        let Embed = new EmbedBuilder()
        let promise = new Promise(async (resolve) => {
            switch (AuditEntry.action) {
                case AuditLogEvent.ChannelCreate:
                    if(await eventState(Guild.id, 'channelCreate')) {resolve(await ChannelCreate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.ChannelDelete:
                    if(await eventState(Guild.id, 'channelDelete')) {resolve(await ChannelDelete(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.ChannelUpdate: case AuditLogEvent.ChannelOverwriteCreate: case AuditLogEvent.ChannelOverwriteDelete: case AuditLogEvent.ChannelOverwriteUpdate:
                    if(await eventState(Guild.id, 'channelUpdate')) {resolve(await ChannelUpdate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.MemberBanAdd:
                    if(await eventState(Guild.id, 'guildBanAdd')) {resolve(await GuildBanAdd(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.MemberBanRemove:
                    if(await eventState(Guild.id, 'guildBanRemove')) {resolve(await GuildBanRemove(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.EmojiCreate:
                    if(await eventState(Guild.id, 'guildEmojiCreate')) {resolve(await GuildEmojiCreate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.EmojiDelete:
                    if(await eventState(Guild.id, 'guildEmojiDelete')) {resolve(await GuildEmojiDelete(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.EmojiUpdate:
                    if(await eventState(Guild.id, 'guildEmojiUpdate')) {resolve(await GuildEmojiUpdate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.MemberKick:
                    //This needs debugging
                    if(await eventState(Guild.id, 'guildMemberRemove')) {resolve(await GuildMemberKick(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.RoleCreate:
                    if(await eventState(Guild.id, 'guildRoleCreate')) {resolve(await GuildRoleCreate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.RoleDelete:
                    if(await eventState(Guild.id, 'guildRoleDelete')) {resolve(await GuildRoleDelete(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.RoleUpdate:
                    if(await eventState(Guild.id, 'guildRoleUpdate')) {resolve(await GuildRoleUpdate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.StickerCreate:
                    if(await eventState(Guild.id, 'guildStickerCreate')) {resolve(await GuildStickerCreate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.StickerDelete:
                    if(await eventState(Guild.id, 'guildStickerDelete')) {resolve(await GuildStickerDelete(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.StickerUpdate:
                    if(await eventState(Guild.id, 'guildStickerUpdate')) {resolve(await GuildStickerUpdate(AuditEntry, Guild, Embed))}
                    break;

                case AuditLogEvent.GuildUpdate:
                    if(await eventState(Guild.id, 'guildUpdate')) {resolve(await GuildUpdate(AuditEntry, Guild, Embed))}
                    break;
            }
        })

        promise.then(async (Embed) => {
            Embed.setTimestamp()
            try {
                await Guild.channels.cache.get(await eventState(Guild.id, 'logChannel')).send({embeds: [Embed]});
            } catch (e) {
                e.guild = Guild
                console.log(e)
            }
        })
    }
})