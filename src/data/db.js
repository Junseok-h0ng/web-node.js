var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'web',
    password: 'gsGS6467!@',
    database: 'web'
});

connection.connect();

connection.query('SELECT * FROM user', function (error, results) {
    if (error) throw error;
    console.log('The solution is: ', results);
});

connection.end();