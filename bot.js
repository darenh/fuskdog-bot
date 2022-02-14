const Discord = require('discord.js')
const axios = require("axios");
const config = require("./config.json");
const token = config.TOKEN;
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const fuskMemberId = "939376274978242581";
const urbanFuskId = 16944520;
const urbannewFuskId = 16974731;

client.on('ready', async () => {
  let upvotes = "undefined";
  await sendPatchNotes(false);
  try {
    const urbanDicResults = await upvoteUrban(urbanFuskId);
    if (urbanDicResults && urbanDicResults.data) {
        upvotes = urbanDicResults.data.up;
    }
    await changeGuildNames(upvotes, false);
    client.user.setActivity("https://www.urbandictionary.com/define.php?term=fuskdog", ({type: "WATCHING"}));
  } catch (error) {
    console.error(error);
  }

    setInterval(async () => {
      try {
        const urbanDicResults = await upvoteUrban(urbanFuskId);
        let isNewUpvote = false;
        if (urbanDicResults && urbanDicResults.data) {
          if (urbanDicResults.data.up > upvotes) {
            isNewUpvote = true;
          }
          upvotes = urbanDicResults.data.up;
        }
        if (isNewUpvote) {
          await changeGuildNames(upvotes, isNewUpvote);
        }
        client.user.setActivity("https://www.urbandictionary.com/define.php?term=fuskdog", ({type: "WATCHING"}));
      } catch (error) {
        console.log(error);
      }

    }, 10000);
})

 

client.on('messageCreate', message => {
  if (message.member && message.member.user && message.member.user.id === fuskMemberId) {
    return;
  }
  if (message.content.toLocaleLowerCase().indexOf('fuskdog') !== -1 || message.content.toLocaleLowerCase().indexOf('fuskkdog') !== -1) {
    message.reply('No bun')
  }
})

const upvoteUrban = async (id) => {
    return await axios({
      method: 'post',
      url: 'https://api.urbandictionary.com/v0/vote',
      data: {
        defid: id,
        direction: "up"
      }
    });
}

const sendPatchNotes = async (send) => {
  if (!send) {
    return;
  }
  try {
    const guilds = await client.guilds.fetch();
    guilds.each(async (guild) => {
      const guildRes = await guild.fetch();
      let channels = await guildRes.channels.fetch();
      channels.each((channel) => {
        if (channel.type === 'GUILD_TEXT') {
          if (channel.name === "general") {
              channel.send('https://fuskdog.com');
            }
          }
      });
    });
  } catch (error) {
    console.error(error);
    return "error";
  }
}

const changeGuildNames = async (upvotes, isNewUpvote) => {
  try {
    const guilds = await client.guilds.fetch();
    guilds.each(async (guild) => {
      const guildRes = await guild.fetch();
      // console.log(guildRes.name);
      if (isNewUpvote) {
        sendToChannels(guildRes, upvotes);
      }
      let member = guildRes.members.cache.get(fuskMemberId);
      if (member.permissions.has("CHANGE_NICKNAME")) {
        member.setNickname(upvotes.toString() + " fuskdoggers!");
      }
    });
  } catch (error) {
    console.error(error);
    return "error";
  }
}

const sendToChannels = async (guildRes, upvotes) => {
  let channels = await guildRes.channels.fetch();
  channels.each((channel) => {
    if (channel.type === 'GUILD_TEXT') {
      if (channel.name === "general") {
        if (upvotes % 50 === 0) {
          channel.send('Fuskdog upvotes have increased! We are at: ' + upvotes + "\n go to https://www.urbandictionary.com/define.php?term=fuskdog to upvote!");
        } else if (upvotes % 10 === 0) {
          channel.send('Fuskdog upvotes have increased! We are at: ' + upvotes);
        }
      }
    }
  });
}

client.login(token);