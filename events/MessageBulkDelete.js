const {client} = require("../constants");
const {Events, AttachmentBuilder, ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, FileBuilder, MessageFlags} = require("discord.js");
const moment = require("moment");
const {tableExists, eventState} = require("../commonFunctions");

client.on(Events.MessageBulkDelete, async (Messages, Channel) => {
    if (await tableExists(Channel.guild.id)) {
        if(await eventState(Channel.guild.id, 'messageBulkDelete')) {
            let format = ''

            Messages.forEach(message => {
                format += `${message.author.tag} (${message.author.id}) | (${message.author.displayAvatarURL()}) | ${moment(message.createdTimestamp).utc().format('MMMM Do YYYY, H:mm:ss')}(UTC): ${message.content}\n`
            })

            let logFile = new AttachmentBuilder(Buffer.from(format), {name: `${Messages.first().author.id}.log`})
            const msgContainer = new ContainerBuilder().setAccentColor(11419645);
            let section = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(`🗑️ **${Messages.size} Messages were deleted**\n-# Author: <@${Messages.first().author.id}>`),)
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(`${Messages.first().author.displayAvatarURL()}`)
                )
            msgContainer.addSectionComponents(section)
            msgContainer.addFileComponents(new FileBuilder().setURL(`attachment://${Messages.first().author.id}.log`))
            msgContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`\`\`\`ansi\n[0;32mAuthor ID: ${Messages.first().author.id}\`\`\`\n`))

            try {
                await Channel.guild.channels.cache.get(await eventState(Channel.guild.id, 'logChannel')).send({components: [msgContainer], allowedMentions: {users: []}, files: [logFile], flags: MessageFlags.IsComponentsV2});
            } catch (e) {
                e.guild = Channel.guild
                console.log(e)
            }
        }
    }
})