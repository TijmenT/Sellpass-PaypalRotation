


const mysql = require('mysql');


const DBConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "axs",
    port: "8889"
};


const DBPool = mysql.createPool(DBConfig);

module.exports = { DBPool };
