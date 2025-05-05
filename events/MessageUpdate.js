const {client} = require("../constants");
const {Events, EmbedBuilder} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");
const Diff = require("diff");

client.on(Events.MessageUpdate, async(OldMessage, NewMessage) => {
    if (await tableExists(NewMessage.guildId)) {
        if(await eventState(NewMessage.guildId, 'messageUpdate')) {
            if(NewMessage.author.id !== client.user.id && OldMessage.content !== '' && OldMessage.content !== NewMessage.content){
                try {

                    const diff = Diff.diffWordsWithSpace(OldMessage.content, NewMessage.content);
                    let diffString = diff.map(part => {
                        if (part.added) return `[0;32m+${part.value}`;
                        if (part.removed) return `[0;31m-${part.value}`;
                        return `[0;37m${part.value}`;
                    }).join('');

                    let Embed = new EmbedBuilder()
                    Embed.setColor('#ae3ffd')
                    Embed.setAuthor({name: `${OldMessage.author.tag}`, iconURL: `${OldMessage.author.displayAvatarURL()}`})
                    Embed.setDescription(`📝 **${OldMessage.author.tag}** edited a message in <#${OldMessage.channel.id}>`)
                    Embed.addFields(
                        {
                            name: '**Channel**',
                            value: `<#${OldMessage.channel.id}> (${OldMessage.channel.id})\n[Go to message](${OldMessage.url})`
                        },
                        {
                            name: '**Difference**',
                            value: `\`\`\`ansi\n${diffString}\`\`\``,
                            inline: false
                        },
                        {
                            name: '**IDs**',
                            value: `\`\`\`ansi\n[0;32mMember ID: ${OldMessage.author.id}\n[0;34mMessage ID: ${OldMessage.id}\`\`\``,
                            inline: false
                        }
                    )

                    Embed.setTimestamp()
                    Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                    try {
                        await NewMessage.guild.channels.cache.get(await eventState(NewMessage.guildId, 'logChannel')).send({embeds: [Embed]});
                    } catch (e) {
                        e.guild = NewMessage.guild
                        console.log(e)
                    }
                } catch (e) {
                    console.log(e)
                    console.log('Something went wrong logging the message update event, fix this later')
                }
            }
        }
    }
})