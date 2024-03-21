const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.MessageUpdate, async(OldMessage, NewMessage) => {
    if (await tableExists(NewMessage.guildId)) {
        if(await eventState(NewMessage.guildId, 'messageUpdate')) {
            if(OldMessage.guild && NewMessage.author.id !== client.user.id && OldMessage.content !== '' && OldMessage.content !== NewMessage.content){
                try {
                    let Embed = new EmbedBuilder()
                    Embed.setColor('#ae3ffd')
                    Embed.setAuthor({name: `${OldMessage.author.tag}`, iconURL: `${OldMessage.author.displayAvatarURL()}`})
                    Embed.setDescription(`**${OldMessage.author.tag}** updated their message in <#${OldMessage.channel.id}>`)
                    Embed.addFields(
                        {
                            name: 'Channel',
                            value: `<#${OldMessage.channel.id}> (${OldMessage.channel.id})\n[Go to message](${OldMessage.url})`
                        },
                        {
                            name: 'New Message',
                            value: NewMessage.content
                        },
                        {
                            name: 'Old Message',
                            value: OldMessage.content
                        },
                        {
                            name: 'ID',
                            value: `\`\`\`ansi\n[0;33mMember = ${OldMessage.author.id}\n[0;32mMessage = ${OldMessage.id}\`\`\``
                        }
                    )

                    Embed.setTimestamp()
                    Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                    await NewMessage.guild.channels.cache.get(await eventState(NewMessage.guildId, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    console.log(OldMessage)
                    console.log(e)
                    console.log('Something went wrong logging the message update event, fix this later')
                }
            }
        }
    }
})