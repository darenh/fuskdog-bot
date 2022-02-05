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
    }, 10000);

})

 

client.on('messageCreate', message => {

  if (message.content === 'ducks') {

    message.reply('Banned.')

  }

})

 

client.login(token);