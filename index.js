const {client} = require("./constants");
const { Collection, REST, Routes, Events } = require('discord.js');
const { token } = require('./config.json')
const fs = require('fs')
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

client.commands = new Collection;

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

});

client.login(token).then(registerCommands);