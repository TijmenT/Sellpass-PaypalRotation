


const mysql = require('mysql');



// Mamp on mac

const DBConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "axs",
    port: "8889"
};


// Xamp on windows
//
// const DBConfig = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "",
//     database: "yourdb",
//     port: "3336"
// };


const DBPool = mysql.createPool(DBConfig);

module.exports = { DBPool };
