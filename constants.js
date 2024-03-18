const { Client, GatewayIntentBits, Partials  } = require('discord.js')

module.exports = Object.freeze({
    client: new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildModeration
        ], partials: [
            Partials.Channel,
            Partials.Message,
            Partials.Reaction
        ] })
});