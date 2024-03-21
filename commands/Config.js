const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const sqlite3 = require("sqlite3");
const {tableExists} = require("../commonFunctions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure OpenLoggerBot')
        .addStringOption(option =>
            option.setName('event')
                .setDescription('Target Event')
                .setRequired(true)
                .setAutocomplete(true))
        .addBooleanOption(option =>
            option.setName('log')
                .setDescription('the state of the event')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),


    async autocomplete(interaction){
        const focus = interaction.options.getFocused();
        const Events = ['channelCreate', 'channelDelete', 'channelUpdate', 'guildBanAdd', 'guildBanRemove', 'guildEmojiCreate', 'guildEmojiDelete', 'guildEmojiUpdate', 'guildInviteCreate', 'guildMemberAdd', 'guildMemberRemove', 'guildMemberOnboarding', 'guildMemberUpdate', 'guildRoleCreate', 'guildRoleDelete', 'guildRoleUpdate', 'guildStickerCreate', 'guildStickerDelete', 'guildStickerUpdate', 'guildUpdate', 'messageBulkDelete', 'messageDelete', 'messageDeleteAttachments', 'messageUpdate', 'voiceStateUpdate']
        const filter = Events.filter(Events => Events.startsWith(focus))
        await interaction.respond(filter.map(Event => ({name: Event, value: Event})))
    },


    execute: async function (interaction) {
        let event = interaction.options.getString('event')
        let eventbool = interaction.options.getBoolean('log')
        let db = new sqlite3.Database('./config.db', (err) => {if (err) {console.log(err.message);}});
        if(await tableExists(interaction.guildId)) {
            db.run(`UPDATE "${interaction.guildId}" SET ${event}="${+ eventbool}"`, function (err) {
                if (err) {
                    return console.log(`Join ${err.message}`)
                }
            })
            db.close()
        }
        if(eventbool) {
            interaction.reply({content: `Started logging ${event} in ${interaction.guild.name}`, ephemeral: true });
        } else {
            interaction.reply({content: `Stopped logging ${event} in ${interaction.guild.name}`, ephemeral: true });
        }
    }
}