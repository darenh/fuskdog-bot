const Discord = require('discord.js')
const axios = require("axios");
const config = require("./config.json");
const token = config.TOKEN;
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

 

client.on('ready', async () => {
    const urbanDicResults = await axios({
        method: 'post',
        url: 'https://api.urbandictionary.com/v0/vote',
        data: {
          defid: 16944520,
          direction: "up"
        }
      });
    let ups = "undefined";
    if (urbanDicResults && urbanDicResults.data) {
        ups = urbanDicResults.data.up;
    }
    const guilds = await client.guilds.fetch();
    guilds.each(async (guild) => {
        const guildRes = await guild.fetch();
        let member = guildRes.members.cache.get("939376274978242581");
        member.setNickname(ups.toString() + " fuskdogers!");
    });
    client.user.setActivity("#Fuskdog " + ups.toString() + " upvotes!", ({type: "WATCHING"}));

    setInterval(async () => {
        const urbanDicResults = await axios({
            method: 'post',
            url: 'https://api.urbandictionary.com/v0/vote',
            data: {
              defid: 16944520,
              direction: "up"
            }
          });
        let ups = "undefined";
        if (urbanDicResults && urbanDicResults.data) {
            ups = urbanDicResults.data.up;
        }
        const guilds = await client.guilds.fetch();
        guilds.each(async (guild) => {
            const guildRes = await guild.fetch();
            let member = guildRes.members.cache.get("939376274978242581");
            member.setNickname(ups.toString() + " fuskdogersss!");
        });
        client.user.setActivity("#Fuskdog " + ups.toString() + " upvotes!", ({type: "WATCHING"}));

        // fetch all msg from the fuskdog-count channel
        let getMessagesFromChannel = await client.channels.cache.get('939578059969921075').messages.fetch();
        // find the last message sent by the bot
        let lastSentMessage = getMessagesFromChannel.find(m => m.author.id === '939376274978242581');
        // filter out the text, we only want the number
        let lastSentUpsCount = lastSentMessage.content.replace(/\D/g, "");

        if(ups > parseInt(lastSentUpsCount))
        {
          const channel = client.channels.cache.get('939578059969921075');
          channel.send('Fuskdog upvotes have increased! We are at: ' + ups);
        }

    }, 10000);
})

 

client.on('messageCreate', message => {

  if (message.content === 'ducks') {

    message.reply('Banned.')

  }

})

 

client.login(token);