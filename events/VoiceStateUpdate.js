const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");
client.on(Events.VoiceStateUpdate, async(OldState, NewState) => {
    if (await tableExists(NewState.guild.id)) {
        if(await eventState(NewState.guild.id, 'voiceStateUpdate')) {
            if(NewState.channelId !== null && !NewState.member.user.bot) {

                let Embed = new EmbedBuilder()
                Embed.setColor('#676767')
                Embed.setAuthor({name: `${NewState.member.user.tag}`, iconURL: `${NewState.member.user.displayAvatarURL()}`})
                Embed.setDescription(`**${NewState.member.user.tag}** joined voice channel ${NewState.channel.name}`)
                Embed.addFields(
                    {
                        name: 'Channel',
                        value: `<#${NewState.channel.id}> (${NewState.channel.name})`
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${NewState.member.id}\n[0;35mChannel = ${NewState.channel.id}\`\`\``
                    }
                )
                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                await NewState.guild.channels.cache.get(await eventState(NewState.guild.id, 'logChannel')).send({embeds: [Embed]});
            }

            if(NewState.channelId == null && !NewState.member.user.bot) {
                let Embed = new EmbedBuilder()
                Embed.setColor('#676767')
                Embed.setAuthor({name: `${NewState.member.user.tag}`, iconURL: `${NewState.member.user.displayAvatarURL()}`})
                Embed.setDescription(`**${NewState.member.user.tag}** left voice channel ${OldState.channel.name}`)
                Embed.addFields(
                    {
                        name: 'Channel',
                        value: `<#${OldState.channel.id}> (${OldState.channel.name})`
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${NewState.member.id}\n[0;35mChannel = ${OldState.channel.id}\`\`\``
                    }
                )
                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                try {
                    await NewState.guild.channels.cache.get(await eventState(NewState.guild.id, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = NewState.guild
                    console.log(e)
                }
            }
        }
    }

})