var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'web',
    password: 'gsGS6467!@',
    database: 'web'
});

connection.connect();
module.exports = {
    user: function (where, id, callback) {
        connection.query(`SELECT * FROM user WHERE ${where} = ?`, [id], function (error, user) {
            if (error) throw error;
            return callback(null, user);
        });
    }
}
