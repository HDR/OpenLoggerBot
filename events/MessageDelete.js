const {client} = require("../constants");
const {Events, MessageFlags, AttachmentBuilder, ContainerBuilder, TextDisplayBuilder, ThumbnailBuilder, SectionBuilder, FileBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder} = require("discord.js");
const {tableExists, eventState} = require("../commonFunctions");

async function buildContainer(Message) {
    const msgContainer = new ContainerBuilder().setAccentColor(11419645);
    let section = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(`**A message was deleted in <#${Message.channel.id}>**\n-# Author: <@${Message.author.id}>\n-# Created: <t:${Math.floor(Message.createdTimestamp / 1000)}:F>`),)
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(`${Message.author.displayAvatarURL()}`)
    )

    const attachments = [];
    if(Message.content.length > 1024) {
        const logFile = new AttachmentBuilder(Buffer.from(Message.content), {name: `${Message.id}.log`});
        attachments.push(logFile);
        section.addTextDisplayComponents(new TextDisplayBuilder().setContent("**Text Contents:** (Attached as file)"))
    } else {
        section.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Text Contents:**\n${Message.content}`))
    }

    msgContainer.addSectionComponents(section)
    msgContainer.addFileComponents(new FileBuilder().setURL(`attachment://${Message.id}.log`))

    if(Message.attachments.size > 0 && Message.attachments.first().contentType !== 'audio/ogg') {
        if(await eventState(Message.guildId, 'messageDeleteAttachments')) {
            let mGallery = []
            msgContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Attachments:**`))
            for (const attachment of Message.attachments.values()) {
                try {
                    const res = await fetch(attachment.url);
                    const arrayBuffer = await res.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const ext = attachment.name?.split(".").pop() || 'png';
                    const fileName = `${attachment.id}.${ext}`
                    const imgAttachment = new AttachmentBuilder(buffer, { name: fileName });
                    attachments.push(imgAttachment);
                    mGallery.push(new MediaGalleryItemBuilder().setURL(`attachment://${fileName}`))
                } catch (e) {
                    console.log(e)
                }
            }
            msgContainer.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(...mGallery))
        }
    }
    msgContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`\`\`\`ansi\n[0;32mAuthor ID: ${Message.author.id}\n[0;34mMessage ID: ${Message.id}\`\`\`\n`))
    return {msgContainer, attachments}
}

client.on(Events.MessageDelete, async (Message) => {
    if (await tableExists(Message.guildId) && await eventState(Message.guildId, 'messageDelete') && !Message.author.bot) {
        const {msgContainer, attachments} = await buildContainer(Message);
        await Message.guild.channels.cache.get(await eventState(Message.guildId, 'logChannel')).send({components: [msgContainer], files: attachments, allowedMentions: {users: []}, flags: MessageFlags.IsComponentsV2});
    }
})