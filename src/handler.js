const { RANDOM } = require("mysql/lib/PoolSelector");
const { DBPool } = require("./db");
const { client } = require('./index');
const axios = require('axios');


const saleDetected = (message, DBPool) => {
  embeds = message.embeds
  embeds.forEach(embed => {
    embed.fields.forEach(field => {
        if (field.name === 'Gateway') {
            gateway = field.value
        }
        if (field.name === 'Price') {
          let priceWithoutEuro = field.value.replace('€', ''); 
          amount = parseFloat(priceWithoutEuro);
      }
    });
  });
  if (!gateway) {
    return message.channel.send("failed");
  }
  if(!amount){
    return message.channel.send("failed");
  }

  if(gateway == "PayPal F&F"){
    addSaletoCount(message, amount, DBPool)
    setTimeout(() => {    
    checkCount(message, DBPool)
    }, 3000);
  }
};

const addSaletoCount = (message, amount, DBPool) => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const sql = "INSERT INTO `amountCount` (dateYMD, amountT) VALUES (?, ?)";

  message.channel.send("Connecting to the database...").then(sentMessage => {
    DBPool.getConnection(async function (err, connection) {
      if (err) {
        sentMessage.edit(`Could not connect to the database`);
        return console.log('MySQL: Pool connection error: ' + err);
      }
      sentMessage.edit(`Inserting data...`);
      connection.query(sql, [dateStr, amount], (queryErr, results) => {
        if (queryErr) {
          console.error("Error inserting sale:", queryErr.message);
          sentMessage.edit(`Could not insert`);
          return;
        }
        sentMessage.edit(`Successfully added to count.`);
        connection.release();
      });
    });
  });
}

const checkCount = (message, DBPool) => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const sql = "SELECT SUM(amountT) AS totalAmount FROM amountCount WHERE dateYMD = ?";

  message.channel.send("Connecting to the database...").then(sentMessage => {
    DBPool.getConnection(async function (err, connection) {
      if (err) {
        sentMessage.edit(`Could not connect to the database`);
        return console.log('MySQL: Pool connection error: ' + err);
      }
      sentMessage.edit(`Fetching data...`);
      connection.query(sql, [dateStr], (queryErr, results) => {
        if (queryErr) {
          console.error("Error fetching count:", queryErr.message);
          sentMessage.edit(`Could not fetch count`);
          return;
        }

        const totalAmount = results[0].totalAmount || 0;
        sentMessage.edit(`Total: ${totalAmount}`);

        if(totalAmount > 75){
          sentMessage.edit(`Changing paypal`);
          setTimeout(() => {
            changePaypal(message, DBPool)
          }, 2000);
        }
        connection.release();
      });
    });
  });
}

const changePaypal = (message, DBPool) => {
  const email = "DO.NOT.SEND.TO.THIS.MAIL@fake.com"

  if (!email) {
    return message.channel.send('No email');
  } else {

    axios.put(
      'https://dev.sellpass.io/self/2978/settings/payments/paypal-ff',
      {
        'email': email,
        'gatewayRules': {
          'blockVpn': false
        }
      },
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI2NjciLCJleHAiOjE3MDQ2MTY4NTR9.-dFrd0wNcy9gnpXPo6qbZ2UG7Nr_Iltb1X8SWt_JXfI'
        }
      }
    )
    .then((res) => {
      if (res.data.message == "Successfully saved PayPal F&F Settings") {
        message.channel.send(`Changed to ${email}`);
        // client.channels.cache.get(`channel id`).send(`changed paypal to: ${email}`); Log when it changed mail if you want
        return;
      } else {
        message.channel.send(`Could not change PayPal mail`);
        return console.log(`${res.data.message}`);
      }
    })
    .catch((err) => {
      message.channel.send(`Could not change PayPal mail`);

      return console.log(err);
    });
  }
};



module.exports = { saleDetected };