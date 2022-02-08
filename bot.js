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
        member.setNickname(ups.toString() + " fuskdoggers!");
    });
    client.user.setActivity("https://www.urbandictionary.com/define.php?term=fuskdog", ({type: "WATCHING"}));

    setInterval(async () => {
      try {
        const urbanDicResults = await axios({
            method: 'post',
            url: 'https://api.urbandictionary.com/v0/vote',
            data: {
              defid: 16944520,
              direction: "up"
            }
        });
        let isNewUpvote = false;
        if (urbanDicResults && urbanDicResults.data) {
          if (urbanDicResults.data.up > ups) {
            isNewUpvote = true;
          }
            ups = urbanDicResults.data.up;
        }
        if (isNewUpvote) {
          const guilds = await client.guilds.fetch();
          guilds.each(async (guild) => {
              const guildRes = await guild.fetch();
              let member = guildRes.members.cache.get("939376274978242581");
              member.setNickname(ups.toString() + " fuskdoggers!");
          });
          client.user.setActivity("https://www.urbandictionary.com/define.php?term=fuskdog", ({type: "WATCHING"}));
        }

        // fetch all msg from the fuskdog-count channel
        let getMessagesFromChannel = await client.channels.cache.get('939578059969921075').messages.fetch();
        // find the last message sent by the bot
        let lastSentMessage = getMessagesFromChannel.find(m => m.author.id === '939376274978242581');
        // filter out the text, we only want the number
        let lastSentUpsCount = -1;
        if (lastSentMessage) {
          lastSentUpsCount = lastSentMessage.content.replace(/\D/g, "");
        }
        if(isNewUpvote)
        {
          const channel = client.channels.cache.get('939578059969921075');
          channel.send('Fuskdog upvotes have increased! We are at: ' + ups);
          const channel2 = client.channels.cache.get('818678013130178572');
          channel2.send('Fuskdog upvotes have increased! We are at: ' + ups);
        }
      } catch (error) {
        console.log(error);
      }

    }, 10000);
})

 

client.on('messageCreate', message => {

  if (message.content.toLocaleLowerCase().indexOf('fuskdog') !== -1 || message.content.toLocaleLowerCase().indexOf('fuskkdog') !== -1) {

    message.reply('No bun')

  }

})

 

client.login(token);