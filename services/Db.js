const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
     host:'localhost',
     user:'root',
     password:'12345',
     database:'express_crud',
});

module.exports = {
     query: (sql, params) => mysqlPool.query(sql, params),
   };
