var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'web',
    password: 'gsGS6467!@',
    database: 'web'
});

connection.connect();
module.exports = {
    user: function (email, callback) {
        connection.query('SELECT * FROM user WHERE email = ?', [email], function (error, user) {
            if (error) throw error;
            return callback(null, user);
        });

    }
}
