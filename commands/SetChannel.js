const {client, player} = require("../constants");
const { PermissionFlagsBits, SlashCommandBuilder} = require("discord.js")
const fs = require('fs');
const servers = require("../servers.json");

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


    execute: function (interaction) {

        servers[interaction.guildId] = interaction.options.getChannel('target').id

        fs.writeFile("./servers.json", JSON.stringify(servers), (err) => {
            if (err) console.log(err);
        });

        interaction.reply({content: `Log channel for ${interaction.guild.name} has been set to ${interaction.options.getChannel('target')}`, ephemeral: true });
    }
}