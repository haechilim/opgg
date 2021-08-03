var mysql = require('mysql');
var conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gocl213@',
    database: 'opgg'
}

var connection = mysql.createConnection(conn);
connection.connect();

console.log(connection);