const {client} = require("../constants");
const {Events, EmbedBuilder, Collection, AttachmentBuilder} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.MessageDelete, async(Message) => {
    if (await tableExists(Message.guildId)) {
        let Embed = new EmbedBuilder()
        if(await eventState(Message.guildId, 'messageDelete')) {
            if(Message.content) {
                Embed.setColor('#ae3ffd')
                Embed.setAuthor({name: `${Message.author.tag}`, iconURL: `${Message.author.displayAvatarURL()}`})
                Embed.setDescription(`Message deleted in in <#${Message.channel.id}>`)
                let sendData = {};
                if(Message.content.length > 1024){
                    sendData.files = [new AttachmentBuilder(Buffer.from(Message.content), {name: `${Message.id}.log`})]
                    Embed.addFields({
                        name: 'Content',
                        value: `Content is above 1024 characters long(${Message.content.length} Characters) and will be embedded as a file`
                    })
                } else {
                    Embed.addFields({
                            name: 'Content',
                            value: `${Message.content}`
                        })
                }
                Embed.addFields(
                    {
                        name: 'Date',
                        value: `<t:${Math.trunc(Date.now()/1000)}:F>`
                    },
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${Message.author.id}\n[0;32mMessage = ${Message.id}\`\`\``
                    }
                )

                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                sendData.embeds = [Embed]
                try {
                    await Message.guild.channels.cache.get(await eventState(Message.guildId, 'logChannel')).send(sendData);
                } catch (e) {
                    e.guild = Message.guild
                    console.log(e)
                }
            }
        }

        if(Message.attachments.size > 0) {
            if(await eventState(Message.guildId, 'messageDeleteAttachments')) {
                if(Message.attachments.first().contentType !== 'audio/ogg') {
                    let embeds = new Collection();
                    await Message.attachments.forEach(function(attachment) {
                        embeds.set(attachment.id, new EmbedBuilder().setColor('#ae3ffd').setDescription(`Attachments for deleted message in <#${Message.channel.id}>`).setAuthor({name: `${Message.author.username}#${Message.author.discriminator}`, iconURL: `${Message.author.displayAvatarURL()}`}).addFields({name: 'ID', value: `\`\`\`ansi\n[0;33mMember = ${Message.author.id}\n[0;32mMessage = ${Message.id}\`\`\``}).setURL(`https://${Message.id}.notarealurl`).setImage(attachment.url).setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`}).setTimestamp())
                    })
                    try {
                        await Message.guild.channels.cache.get(await eventState(Message.guildId, 'logChannel')).send({embeds: Array.from(embeds.values())});
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
    }
})