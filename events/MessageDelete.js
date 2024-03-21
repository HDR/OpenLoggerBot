const {client} = require("../constants");
const {Events, EmbedBuilder, Collection} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");


client.on(Events.MessageDelete, async(Message) => {
    if (await tableExists(Message.guildId)) {
        let Embed = new EmbedBuilder()
        if(await eventState(Message.guildId, 'messageDelete')) {
            if(Message.content) {
                Embed.setColor('#ae3ffd')
                Embed.setAuthor({name: `${Message.author.username}#${Message.author.discriminator}`, iconURL: `${Message.author.displayAvatarURL()}`})
                Embed.setDescription(`Message deleted in in <#${Message.channel.id}>`)
                Embed.addFields(
                    {
                        name: 'Content',
                        value: `${Message.content}`
                    },
                    {
                        name: 'Date',
                        value: `<t:${Math.trunc(Date.now()/1000)}:F>`
                    }
                )

                Embed.addFields(
                    {
                        name: 'ID',
                        value: `\`\`\`ansi\n[0;33mMember = ${Message.author.id}\n[0;32mMessage = ${Message.id}\`\`\``
                    }
                )

                Embed.setTimestamp()
                Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
                try {
                    await Message.guild.channels.cache.get(await eventState(Message.guildId, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    e.guild = Message.guild
                    console.log(e)
                }
            }
        }

        if(await eventState(Message.guildId, 'messageDeleteAttachments')) {
            if(Message.attachments.size > 0) {
                let embeds = new Collection();
                Message.attachments.forEach(function(attachment) {
                    embeds.set(attachment.id, new EmbedBuilder().setColor('#ae3ffd').setDescription(`Attachments for deleted message in <#${Message.channel.id}>`).setAuthor({name: `${Message.author.username}#${Message.author.discriminator}`, iconURL: `${Message.author.displayAvatarURL()}`}).addFields( { name: 'ID', value: `\`\`\`ansi\n[0;33mMember = ${Message.author.id}\n[0;32mMessage = ${Message.id}\`\`\`` }).setURL('https://discord.gg/gameboy').setImage(attachment.url).setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`}).setTimestamp())
                })
                try {
                    await Message.guild.channels.cache.get(await eventState(Message.guildId, 'logChannel')).send({embeds: [Embed]});
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
})