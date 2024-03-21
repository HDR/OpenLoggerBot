const {client} = require("../constants");
const {Events, EmbedBuilder } = require("discord.js");
const {pastebin_key} = require("../config.json")
const { PasteClient, Publicity, ExpireDate } = require("pastebin-api");
const moment = require("moment");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.MessageBulkDelete, async (Messages, Channel) => {
    if (await tableExists(Channel.guild.id)) {
        if(await eventState(Channel.guild.id, 'messageBulkDelete')) {
            const pb_c = new PasteClient(pastebin_key)
            let Embed = new EmbedBuilder()
            let format = ''

            Messages.forEach(message => {
                format += `${message.author.tag} (${message.author.id}) | (${message.author.displayAvatarURL()}) | ${moment(message.createdTimestamp).format('MMMM Do YYYY, H:mm:ss')}: ${message.content}\n`
            })

            const paste = await pb_c.createPaste({
                code: `${format}`,
                expireDate: ExpireDate.Never,
                name: `${Messages.first().author.id}.log`,
                publicity: Publicity.Unlisted
            })

            Embed.setDescription(`Deleted **${Messages.size}** message(s)`)
            Embed.addFields(
                {
                    name: 'Link',
                    value: `${paste}`
                }
            )

            Embed.setTimestamp()
            Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
            await Channel.guild.channels.cache.get(await eventState(Channel.guild.id, 'logChannel')).send({embeds: [Embed]});
        }
    }
})