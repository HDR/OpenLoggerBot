const {client} = require("../constants");
const {Events, EmbedBuilder, Collection} = require("discord.js");
const servers = require("../servers.json");


client.on(Events.MessageDelete, async(Message) => {
    if(Message.content) {
        let Embed = new EmbedBuilder()
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
        if(servers[Message.guild.id]){await Message.guild.channels.cache.get(servers[Message.guild.id]).send({embeds: [Embed]});}
    }

    //Log deleted attachments
    if(Message.attachments.size > 0) {
        let embeds = new Collection();
        Message.attachments.forEach(function(attachment) {
            embeds.set(attachment.id, new EmbedBuilder().setColor('#ae3ffd').setDescription(`Attachments for deleted message in <#${Message.channel.id}>`).setAuthor({name: `${Message.author.username}#${Message.author.discriminator}`, iconURL: `${Message.author.displayAvatarURL()}`}).addFields( { name: 'ID', value: `\`\`\`ansi\n[0;33mMember = ${Message.author.id}\n[0;32mMessage = ${Message.id}\`\`\`` }).setURL('https://discord.gg/gameboy').setImage(attachment.url).setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`}).setTimestamp())
        })
        try {
            await Message.guild.channels.cache.get(log_channel).send({embeds: Array.from(embeds.values())});
        } catch (e) {
            console.log(e)
        }
    }
})