const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");
client.on(Events.VoiceStateUpdate, async(OldState, NewState) => {
    if (await tableExists(NewState.guild.id)) {
        if(await eventState(NewState.guild.id, 'voiceStateUpdate')) {
            let Embed = new EmbedBuilder()
            Embed.setColor('#676767')
            Embed.setAuthor({name: `${NewState.member.user.tag}`, iconURL: `${NewState.member.user.displayAvatarURL()}`})
            Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
            Embed.setTimestamp()

            if(NewState.channelId !== null && OldState.channelId !== null && NewState.channelId !== OldState.channelId) {
                Embed.setDescription(`**${NewState.member.user.tag}** switched voice channels from ${OldState.channel} to ${NewState.channel}`)
                Embed.addFields(
                    {
                        name: '**Old Channel**',
                        value: `${OldState.channel}`
                    },
                    {
                        name: '**New Channel**',
                        value: `${NewState.channel}`
                    },
                    {
                        name: '**ID**',
                        value: `\`\`\`ansi\n[0;33mMember ID: ${NewState.member.id}\n[0;35mOld Channel ID: ${OldState.channel.id}\n[0;34mNew Channel ID: ${NewState.channel.id}\`\`\``
                    }
                )
            }

            if(!NewState.member.user.bot && NewState.channelId !== null && OldState.channelId === null && NewState.channelId !== OldState.channelId) {
                Embed.setDescription(`**${NewState.member.user.tag}** joined voice channel ${NewState.channel}`)
                Embed.addFields(
                    {
                        name: '**Channel**',
                        value: `${NewState.channel}`
                    },
                    {
                        name: '**ID**',
                        value: `\`\`\`ansi\n[0;33mMember ID: ${NewState.member.id}\n[0;35mChannel ID: ${NewState.channel.id}\`\`\``
                    }
                )
            }

            if(!NewState.member.user.bot && NewState.channelId === null & OldState.channelId !== null & NewState.channelId !== OldState.channelId){
                Embed.setDescription(`**${NewState.member.user.tag}** left voice channel ${OldState.channel}`)
                Embed.addFields(
                    {
                        name: '**Channel**',
                        value: `${OldState.channel}`
                    },
                    {
                        name: '**IDs**',
                        value: `\`\`\`ansi\n[0;33mMember ID: ${NewState.member.id}\n[0;35mChannel ID: ${OldState.channel.id}\`\`\``
                    }
                )
            }

            if(Embed.data.fields) {
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