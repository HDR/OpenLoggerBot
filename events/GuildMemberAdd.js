const {client} = require("../constants");
const { EmbedBuilder, Collection, Events } = require("discord.js");
const itrack = require('@androz2091/discord-invites-tracker')
const { log_channel } = require("./config/events.json")

const guildInvites = new Collection();

client.on(Events.InviteCreate, async invite => {
    guildInvites.get(invite.guild.id).set(invite.code, invite.uses)
    const Embed = new EmbedBuilder();
    Embed.setColor('#ffd400');
    Embed.setTitle("User created new invite")
    Embed.addFields({name: 'User', value: `${invite.inviter.username}#${invite.inviter.discriminator}`}, {name: 'Code', value: invite.code})
    await invite.guild.channels.cache.get(log_channel).send({embeds: [Embed]});

})

client.on(Events.InviteDelete, (invite) => {
    guildInvites.get(invite.guild.id).delete(invite.code)
})

client.on(Events.ClientReady, () => {
    client.guilds.cache.forEach(async guild => {
        const firstInvites = await guild.invites.fetch();
        guildInvites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
    })
})

const tracker = itrack.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on('guildMemberAdd', async (member, type, invite) => {

    //Handle unreadable names
    let normalize = member.user.username.normalize("NFKC")
    if(normalize !== member.user.username) {
        await member.setNickname(normalize)
    }

    const Embed = new EmbedBuilder();
    Embed.setColor('#2cff00');
    Embed.setDescription(`<@${member.user.id}> joined`)
    Embed.setAuthor({name: `${member.user.tag}`, iconURL: `${member.displayAvatarURL()}`})
    let currentDate = new Date();
    if(Math.trunc(Math.ceil(currentDate.getTime() - member.user.createdAt.getTime()) / (1000 * 3600 * 24)) < 7 && !member.user.bot) {
        member.kick('Account is too new (less than 7 days old)')
    } else {
        Embed.addFields({
                name: 'Name',
                value: `${member.user.tag} (${member.user.id}) <@${member.user.id}>`,
                inline: false
            },
            {
                name: 'Joined At',
                value: `<t:${Math.trunc(member.joinedTimestamp/1000)}:F>`,
                inline: false
            },
            {
                name: 'Account Age',
                value: `**${Math.trunc(Math.ceil(currentDate.getTime() - member.user.createdAt.getTime()) / (1000 * 3600 * 24))}** days`,
                inline: true
            },
            {
                name: 'Member Count',
                value: `${member.guild.memberCount}`,
                inline: true
            })

        switch (type) {
            case 'normal':
                Embed.addFields( {name: 'Invite Used', value: `${invite.code} by ${invite.inviter.tag} with ${invite.uses} uses`, inline: true})
                break;
            case 'vanity':
                Embed.addFields({name: 'Invite Used', value: 'gameboy', inline: true})
                break;
            case 'unknown':
                Embed.addFields({name: 'Invite Used', value: 'unknown', inline: true})
                break;
        }


        Embed.addFields({
            name: 'ID',
            value: `\`\`\`ansi\n[0;33mMember = ${member.user.id}\n[0;34mGuild = ${member.guild.id}\`\`\``
        })

        Embed.setTimestamp()
        Embed.setFooter({text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`})
        await member.guild.channels.cache.get(log_channel).send({embeds: [Embed]});
    }
});