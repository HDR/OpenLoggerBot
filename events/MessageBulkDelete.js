const {client} = require("../constants");
const {Events, EmbedBuilder, AttachmentBuilder} = require("discord.js");
const moment = require("moment");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.MessageBulkDelete, async (Messages, Channel) => {
    if (await tableExists(Channel.guild.id)) {
        if(await eventState(Channel.guild.id, 'messageBulkDelete')) {
            let Embed = new EmbedBuilder()
            let format = ''

            Messages.forEach(message => {
                format += `${message.author.tag} (${message.author.id}) | (${message.author.displayAvatarURL()}) | ${moment(message.createdTimestamp).utc().format('MMMM Do YYYY, H:mm:ss')}(UTC): ${message.content}\n`
            })

            let logFile = new AttachmentBuilder(Buffer.from(format), {name: `${Messages.first().author.id}.log`})

            Embed.setDescription(`Deleted **${Messages.size}** message(s)`)
            Embed.setTimestamp()
            Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
            try {
                await Channel.guild.channels.cache.get(await eventState(Channel.guild.id, 'logChannel')).send({embeds: [Embed], files: [logFile]});
            } catch (e) {
                e.guild = Channel.guild
                console.log(e)
            }
        }
    }
})