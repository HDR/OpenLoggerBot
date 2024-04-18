const { PermissionFlagsBits, SlashCommandBuilder} = require("discord.js")
const sqlite3 = require("sqlite3");
const {tableExists} = require("../commonFunctions");
const {client} = require("../constants");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set the target log channel')
        .addChannelOption(option =>
            option.setName('target')
                .setDescription('Target Channel')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),


    execute: async function (interaction) {

        const Data = {
            logChannel: interaction.options.getChannel('target').id,
            channelCreate: true,
            channelDelete: true,
            channelUpdate: true,
            guildBanAdd: true,
            guildBanRemove: true,
            guildEmojiCreate: true,
            guildEmojiDelete: true,
            guildEmojiUpdate: true,
            guildInviteCreate: true,
            guildMemberAdd: true,
            guildMemberRemove: true,
            guildMemberOnboarding: true,
            guildMemberUpdate: true,
            guildRoleCreate: true,
            guildRoleDelete: true,
            guildRoleUpdate: true,
            guildStickerCreate: true,
            guildStickerDelete: true,
            guildStickerUpdate: true,
            guildUpdate: true,
            messageBulkDelete: true,
            messageDelete: true,
            messageDeleteAttachments: true,
            messageUpdate: true,
            voiceStateUpdate: true
        }

        if (interaction.options.getChannel('target').permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
            let db = new sqlite3.Database('./config.db', (err) => {if (err) {console.log(err.message);}});
            db.serialize(() => {
                db.prepare(`CREATE TABLE IF NOT EXISTS "${interaction.guildId}" (logChannel text, channelCreate integer, channelDelete integer, channelUpdate integer, guildBanAdd integer, guildBanRemove integer, guildEmojiCreate integer, guildEmojiDelete integer, guildEmojiUpdate integer, guildInviteCreate integer, guildMemberAdd integer, guildMemberRemove integer, guildMemberOnboarding integer, guildMemberUpdate integer, guildRoleCreate integer, guildRoleDelete integer, guildRoleUpdate integer, guildStickerCreate integer, guildStickerDelete integer, guildStickerUpdate integer, guildUpdate integer, messageBulkDelete integer, messageDelete integer, messageDeleteAttachments integer, messageUpdate integer, voiceStateUpdate integer)`).run().finalize();
            });
            if(await tableExists(interaction.guildId)) {
                db.run(`UPDATE "${interaction.guildId}" SET logChannel="${Data.logChannel}"`, function (err) {
                    if (err) {
                        return console.log(`Join ${err.message}`)
                    }
                })
                db.close()
            } else {
                db.run(`INSERT INTO "${interaction.guildId}"(logChannel, channelCreate, channelDelete, channelUpdate, guildBanAdd, guildBanRemove, guildEmojiCreate, guildEmojiDelete, guildEmojiUpdate, guildInviteCreate, guildMemberAdd, guildMemberRemove, guildMemberOnboarding, guildMemberUpdate, guildRoleCreate, guildRoleDelete, guildRoleUpdate, guildStickerCreate, guildStickerDelete, guildStickerUpdate, guildUpdate, messageBulkDelete, messageDelete, messageDeleteAttachments, messageUpdate, voiceStateUpdate) VALUES($logChannel, $channelCreate, $channelDelete, $channelUpdate, $guildBanAdd, $guildBanRemove, $guildEmojiCreate, $guildEmojiDelete, $guildEmojiUpdate, $guildInviteCreate, $guildMemberAdd, $guildMemberRemove, $guildMemberOnboarding, $guildMemberUpdate, $guildRoleCreate, $guildRoleDelete, $guildRoleUpdate, $guildStickerCreate, $guildStickerDelete, $guildStickerUpdate, $guildUpdate, $messageBulkDelete, $messageDelete, $messageDeleteAttachments, $messageUpdate, $voiceStateUpdate)`, [Data.logChannel, Data.channelCreate, Data.channelDelete, Data.channelUpdate, Data.guildBanAdd, Data.guildBanRemove, Data.guildEmojiCreate, Data.guildEmojiDelete, Data.guildEmojiUpdate, Data.guildInviteCreate, Data.guildMemberAdd, Data.guildMemberRemove, Data.guildMemberOnboarding, Data.guildMemberUpdate, Data.guildRoleCreate, Data.guildRoleDelete, Data.guildRoleUpdate, Data.guildStickerCreate, Data.guildStickerDelete, Data.guildStickerUpdate, Data.guildUpdate, Data.messageBulkDelete, Data.messageDelete, Data.messageDeleteAttachments, Data.messageUpdate, Data.voiceStateUpdate], function (err) {
                    if (err) {
                        return console.log(`Join ${err.message}`)
                    }
                })
                db.close()
            }
            interaction.reply({content: `Log channel for ${interaction.guild.name} has been set to ${interaction.options.getChannel('target')}`, ephemeral: true });
        } else {
            interaction.reply({content: `Please give ${client.user} read access to ${interaction.options.getChannel('target')} before running this command`, ephemeral: true });
        }
    }
}