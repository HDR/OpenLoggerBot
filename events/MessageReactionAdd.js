const {client} = require("../constants");
const {Events, REST, Routes} = require("discord.js");
const { token } = require('../config.json')



client.on(Events.MessageReactionAdd, async (MessageReaction, user) => {
    const rest = new REST({version: 10}).setToken(token)
    let data = await rest.get(
        Routes.channelMessage(MessageReaction.message.channelId, MessageReaction.message.id)
    )
    if(data.reactions[Object.keys(data.reactions).length-1].count_details.burst >= 1) {
        MessageReaction.remove()
    }
})