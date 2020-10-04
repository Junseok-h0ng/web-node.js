var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'web',
    password: 'gsGS6467!@',
    database: 'web',
    dateStrings: 'date'
});

connection.connect();
module.exports = {
    user: function (where, id, callback) {
        connection.query(`SELECT * FROM user WHERE ${where} = ?`, [id], (err, user) => {
            if (err) throw err;
            return callback(null, user);
        });
    },
    insertUser: function (id, user, pwd) {
        const sql = 'INSERT INTO user(id,displayname,email,pwd,type) VALUES(?,?,?,?,?)';
        connection.query(sql, [id, user.displayname, user.email, pwd, user.type]);
    },
    insertTopic: function (info) {
        const sql = 'INSERT INTO topic(id,title,description,user_id,created) VALUES(?,?,?,?,NOW())'
        connection.query(sql, [info.id, info.title, info.description, info.userID]);
    },
    updateTopic: function (info) {
        const sql = 'UPDATE topic set title=?,description=?,created=NOW() WHERE id = ?';
        connection.query(sql, [info.title, info.description, info.id]);
    },
    deleteTopic: function (pageID) {
        const sql = 'DELETE FROM topic WHERE id = ?';
        connection.query(sql, [pageID]);
    },
    topicLength: function (callback) {
        const sql = 'SELECT id FROM topic';
        connection.query(sql, (err, topic) => {
            if (err) throw err;
            return callback(null, topic);
        })
    },
    topicList: function (min, callback) {
        const sql = `SELECT topic.*,user.displayname FROM topic LEFT JOIN user ON topic.user_id = user.id ORDER BY created desc limit ${min}, 3`;
        connection.query(sql, (err, topic) => {
            if (err) throw err;
            return callback(null, topic);
        })
    },
    topic: function (id, callback) {
        const sql = 'SELECT * FROM topic WHERE id = ?';
        connection.query(sql, [id], (err, topic) => {
            if (err) throw err;
            return callback(null, topic);
        })
    },
    userTopicLength: function (userID, callback) {
        const sql = `SELECT id FROM topic WHERE user_id = ?`;
        connection.query(sql, [userID], (err, topic) => {
            if (err) throw err;
            return callback(null, topic);
        })
    },
    userTopic: function (min, userID, callback) {
        const sql = `SELECT * FROM topic WHERE user_id =? ORDER BY created desc limit ${min}, 3`;
        connection.query(sql, [userID], (err, topic) => {
            if (err) throw err;
            return callback(null, topic);
        })
    },
    subtopicLength: function (parentTopic, callback) {
        const sql = `SELECT id FROM ${parentTopic}`;
        connection.query(sql, [parentTopic], (err, subTopic) => {
            if (err) {
                return callback(null, false);
            } else {
                return callback(null, subTopic);
            };
        })
    },
    subtopic: function (min, parentTopic, callback) {
        const sql = `SELECT * FROM ${parentTopic} ORDER BY created desc limit ${min}, 3`;
        connection.query(sql, [parentTopic], (err, subTopic) => {
            if (err) {
                return callback(null, []);
            } else {
                return callback(null, subTopic);
            }
        });
    },
    hasSubtopic: function (parentID) {
        const sql = `SELECT id FROM ${parentID}`;
        connection.query(sql, [parentID], (err) => {
            if (err) {
                return true;
            } else {
                return false;
            }
        })
    },
    createTable: function (parentID) {

        const sql = `CREATE TABLE ${parentID}(
            id VARCHAR(9), title VARCHAR(12) PRIMARY KEY, 
            description TEXT,
            created DATETIME)`;
        connection.query(sql);
    },
    insertSubtopic: function (info) {
        if (!this.hasSubtopic(info.parentID)) {
            this.createTable(info.parentID);
        }
        console.log('d');
    },
    deleteUser: function (userID) {
        const sql = 'DELETE FROM user WHERE id = ?';
        const deleteAllTopic = 'DELETE FROM topic WHERE user_id =?';
        connection.query(deleteAllTopic, [userID]);
        connection.query(sql, [userID]);

    },
    changePwdUser: function (newPwd, userID) {
        const sql = 'UPDATE user set pwd =? where id =?';
        connection.query(sql, [newPwd, userID]);
    }
}
