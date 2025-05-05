const { Collection, REST, Routes, Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const fs = require('fs')
const sqlite3 = require("sqlite3");
const { token } = require('./config.json')
const { client } = require("./constants");
const { tableExists, eventState } = require("./commonFunctions");

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const eventHandlers = {};
for (const file of eventFiles) {
    const event = file.replace('.js', '');
    eventHandlers[event] = require(`./events/${file}`)[event]
}

client.commands = new Collection;
new sqlite3.Database('./config.db', (err) => {if (err) {console.log(err.message);}});
const rest = new REST({ version: '10' }).setToken(token);

for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
}

async function registerCommands(){
    const commandData = []
    for (const file of commands) {
        if (!client.application?.owner) await client.application?.fetch();
        const command = require(`./commands/${file}`);
        commandData.push(command.data.toJSON());
    }

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

client.on(Events.GuildAuditLogEntryCreate, async (AuditEntry, Guild) => {
    if(!(await tableExists(Guild.id))) return;
    let Embed = new EmbedBuilder()

    const eventMap = {
        [AuditLogEvent.ChannelCreate]: { event: 'channelCreate', handler: eventHandlers["ChannelCreate"]},
        [AuditLogEvent.ChannelDelete]: { event: 'channelDelete', handler: eventHandlers["ChannelDelete"]},
        [AuditLogEvent.ChannelUpdate]: { event: 'channelUpdate', handler: eventHandlers["ChannelUpdate"]},
        [AuditLogEvent.MemberBanAdd]: { event: 'guildBanAdd', handler: eventHandlers["GuildBanAdd"]},
        [AuditLogEvent.MemberBanRemove]: { event: 'guildBanRemove', handler: eventHandlers["GuildBanRemove"]},
        [AuditLogEvent.EmojiCreate]: { event: 'guildEmojiCreate', handler: eventHandlers["GuildEmojiCreate"]},
        [AuditLogEvent.EmojiDelete]: { event: 'guildEmojiDelete', handler: eventHandlers["GuildEmojiDelete"]},
        [AuditLogEvent.EmojiUpdate]: { event: 'guildEmojiUpdate', handler: eventHandlers["GuildEmojiUpdate"]},
        [AuditLogEvent.MemberKick]: { event: 'guildMemberRemove', handler: eventHandlers["GuildMemberRemove"]},
        [AuditLogEvent.RoleCreate]: { event: 'guildRoleCreate', handler: eventHandlers["GuildRoleCreate"]},
        [AuditLogEvent.RoleDelete]: { event: 'guildRoleDelete', handler: eventHandlers["GuildRoleDelete"]},
        [AuditLogEvent.RoleUpdate]: { event: 'guildRoleUpdate', handler: eventHandlers["GuildRoleUpdate"]},
        [AuditLogEvent.StickerCreate]: { event: 'guildStickerCreate', handler: eventHandlers["GuildStickerCreate"]},
        [AuditLogEvent.StickerDelete]: { event: 'guildStickerDelete', handler: eventHandlers["GuildStickerDelete"]},
        [AuditLogEvent.StickerUpdate]: { event: 'guildStickerUpdate', handler: eventHandlers["GuildStickerUpdate"]},
        [AuditLogEvent.GuildUpdate]: { event: 'guildUpdate', handler: eventHandlers["GuildUpdate"]},
    }

    if (!eventMap[AuditEntry.action] || !(await eventState(Guild.id, eventMap[AuditEntry.action].event))) return;

    try {
        await eventMap[AuditEntry.action].handler(AuditEntry, Guild, Embed);
        Embed.setTimestamp()
        await Guild.channels.cache.get(await eventState(Guild.id, 'logChannel')).send({embeds: [Embed]});
    } catch (e) {
        e.guild = Guild;
        console.log(e)
    }

})