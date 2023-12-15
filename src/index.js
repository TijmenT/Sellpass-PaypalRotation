require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { DBPool } = require('./db.js');
const { saleDetected } = require('./handler.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('ready', () => {
    console.log('Connected and listening to sales.');
});

client.on('messageCreate', message => {
    if (message.author.username != "Sellpass Notifications") return;
    try {
        if (message.embeds.length > 0) {
            message.embeds.forEach(embed => {
                if (embed.title && embed.title.includes("New completed order")) {
                    saleDetected(message, DBPool)
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
});


client.login(process.env.BOT_TOKEN);

