const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const servers = require("../servers.json");


client.on(Events.VoiceStateUpdate, async(oldState, newState) => {

    if(newState.channelId !== null && !newState.member.user.bot) {

        let Embed = new EmbedBuilder()
        Embed.setColor('#676767')
        Embed.setAuthor({name: `${newState.member.user.tag}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
        Embed.setDescription(`**${newState.member.user.tag}** joined voice channel ${newState.channel.name}`)
        Embed.addFields(
            {
                name: 'Channel',
                value: `<#${newState.channel.id}> (${newState.channel.name})`
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${newState.member.id}\n[0;35mChannel = ${newState.channel.id}\`\`\``
            }
        )
        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})

        await newState.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }

    if(newState.channelId == null && !newState.member.user.bot) {

        let Embed = new EmbedBuilder()
        Embed.setColor('#676767')
        Embed.setAuthor({name: `${newState.member.user.tag}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
        Embed.setDescription(`**${newState.member.user.tag}** left voice channel ${oldState.channel.name}`)
        Embed.addFields(
            {
                name: 'Channel',
                value: `<#${oldState.channel.id}> (${oldState.channel.name})`
            },
            {
                name: 'ID',
                value: `\`\`\`ansi\n[0;33mMember = ${newState.member.id}\n[0;35mChannel = ${oldState.channel.id}\`\`\``
            }
        )
        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        if(servers[newState.guild.id]){await newState.guild.channels.cache.get(servers[newState.guild.id]).send({embeds: [Embed]});}
    }

})