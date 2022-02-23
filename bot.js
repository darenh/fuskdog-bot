const Discord = require('discord.js')
const axios = require("axios");
const config = require("./config.json");
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;

const token = config.TOKEN;
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const fuskMemberId = config.BOT_ID;
const urbanFuskId = 16944520;
const prefix = "?";
const serviceAccount = require("./fuskdog-firebaseDB.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const DB = admin.firestore();
let refGoals = DB.collection('set-goals');
let upvotes = "undefined";

client.on('ready', async () => {
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

    setInterval( async () => {
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

client.on('messageCreate', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) {
    return;
  }

  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLocaleLowerCase();

  if (command === 'setgoal') {
    if (/^\d+$/.test(args) && parseInt(args) > upvotes && parseInt(args) <= Number.MAX_SAFE_INTEGER) {
      try {
        refGoals.doc(msg.guildId).update('goal', FieldValue.arrayUnion(parseInt(args)), {merge: true})
        msg.channel.send("Goal Set! :rocket:")
      } catch(e) {
        console.log(e)
        return 'Error';
      }
    }
  } else if (command === 'define') {
    msg.channel.send("https://www.urbandictionary.com/define.php?term=fuskdog");
  }
})

client.on('messageCreate', message => {
    if (message.member && message.member.user && message.member.user.id === fuskMemberId) {
    return;
  }
  if (message.content.toLocaleLowerCase().indexOf('fuskdog') !== -1 || message.content.toLocaleLowerCase().indexOf('fuskkdog') !== -1) {
    message.reply('No bun');
    message.react("🌭");
  }
})


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


const upvoteUrban = async (id) => {
  try {
    return await axios({
      method: 'post',
      url: 'https://api.urbandictionary.com/v0/vote',
      data: {
        defid: id,
        direction: "up"
      }
    });
  } catch (error) {
    console.log(error);
 }
}

const changeGuildNames = async (isNewUpvote) => {
  try {
    const guilds = await client.guilds.fetch();
    guilds.each(async (guild) => {
      const guildRes = await guild.fetch();
      if (isNewUpvote) {
        sendToChannels(guildRes);
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

const sendToChannels = async (guildRes) => {
  let channels = await guildRes.channels.fetch();
  channels.each((channel) => {
    if (channel.type === 'GUILD_TEXT') {
      if (channel.name === "general") {

        checkForGoals(guildRes.id, channel);

        if (upvotes % 50 === 0) {
          channel.send('Fuskdog upvotes have increased! We are at: ' + upvotes + "\n go to https://www.urbandictionary.com/define.php?term=fuskdog to upvote!");
        } else if (upvotes % 10 === 0) {
          channel.send('Fuskdog upvotes have increased! We are at: ' + upvotes);
        }
      }
    }
  });
}

const checkForGoals = async (guildId, channel) => {

  refGoals.doc(guildId).get().then((doc) => {
    if (doc && doc.data() && doc.data().goal.includes(parseInt(upvotes)))
            channel.send(":rocket::rocket::rocket: Goal Reached: " + upvotes + " :rocket::rocket::rocket:");
  })
}

client.login(token);
