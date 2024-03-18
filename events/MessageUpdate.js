const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const { log_channel } = require("./config/events.json")


client.on(Events.MessageUpdate, async(oldMessage, newMessage) => {
    if(!oldMessage.thread) {
        if(oldMessage.guild && newMessage.author.id !== client.user.id && oldMessage.content !== '' && oldMessage.content !== newMessage.content){
            try {
                let Embed = new EmbedBuilder()
                Embed.setColor('#ae3ffd')
                Embed.setAuthor({name: `${oldMessage.author.tag}`, iconURL: `${oldMessage.author.displayAvatarURL()}`})
                Embed.setDescription(`**${oldMessage.author.tag}** updated their message in <#${oldMessage.channel.id}>`)
                Embed.addFields(
                    {
                        name: 'Channel',
                        value: `<#${oldMessage.channel.id}> (${oldMessage.channel.name})\n[Go to message](${oldMessage.url})`
                    },
                    {
                        name: 'New Message',
                        value: newMessage.content
                    },
                    {
                        name: 'Old Message',
                        value: oldMessage.content
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${oldMessage.author.id}\n[0;32mMessage = ${oldMessage.id}\`\`\``
                    }
                )

                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})

                await oldMessage.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
            } catch (e) {
                console.log(oldMessage)
                console.log(e)
                console.log('Something went wrong logging the message update event, fix this later')
            }
        }
    }
})