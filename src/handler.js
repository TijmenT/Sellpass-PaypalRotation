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
    }, 5000);
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
        sentMessage.edit(`Total today: ${totalAmount}`);

        if(totalAmount > process.env.SwitchOnAmount){
          setTimeout(() => {
            selectNewPaypal(message, DBPool)
          }, 2000);
        }
        connection.release();
      });
    });
  });
} 

const changePaypal = (message, DBPool, email) => {

  if (!email) {
    return message.channel.send('No email');
  } else {

    axios.put(
      `https://dev.sellpass.io/self/${process.env.SHOP}/settings/payments/paypal-ff`,
      {
        'email': email,
        'gatewayRules': {
          'blockVpn': false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.KEY}`
        }
      }
    )
    .then((res) => {
      if (res.data.message == "Successfully saved PayPal F&F Settings") {
        message.channel.send(`Changed to ${email}`);
        // client.channels.cache.get(`channel id`).send(`changed paypal to: ${email}`); Log when it changed mail if you want
        setTimeout(() => {
          resetTodayCount(message, DBPool)
        }, 2000);
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

const selectNewPaypal = (message, DBPool) => {
  const selectRandomSql = "SELECT mail FROM paypals WHERE IsUsed = 0 ORDER BY RAND() LIMIT 1";
  const updateSql = "UPDATE paypals SET IsUsed = CASE WHEN mail = ? THEN 1 ELSE 0 END";

  DBPool.getConnection(async function (err, connection) {
    if (err) {
      console.log('MySQL: Pool connection error: ' + err);
      return message.channel.send('Could not connect to the database');
    }

    connection.query(selectRandomSql, async (selectErr, results) => {
      if (selectErr || results.length === 0) {
        console.error("Error selecting new PayPal:", selectErr?.message);
        return message.channel.send('Could not select a new PayPal email');
      }

      const newPaypalEmail = results[0].mail;

      connection.query(updateSql, [newPaypalEmail], (updateErr) => {
        if (updateErr) {
          console.error("Error updating PayPal status:", updateErr.message);
          return message.channel.send('Could not update PayPal email status');
        }
        connection.release();
        setTimeout(() => {
        changePaypal(message, DBPool, newPaypalEmail)
        }, 5000);
      });
    });
  });
};

const resetTodayCount = (message, DBPool) => {
  const truncateSql = "TRUNCATE TABLE amountCount";

  DBPool.getConnection(async function (err, connection) {
    if (err) {
      console.log('MySQL: Pool connection error: ' + err);
      return message.channel.send('Could not connect to the database');
    }

    connection.query(truncateSql, (truncateErr) => {
      if (truncateErr) {
        console.error("Error truncating amountCount table:", truncateErr.message);
        return message.channel.send('Could not truncate amountCount table');
      }

      message.channel.send(`Count has been reset to 0`);
      connection.release();
    });
  });
};



module.exports = { saleDetected };