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
        deleteParentIDSubtopic(pageID);
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
        const sql = `SELECT * FROM topic WHERE user_id =? ORDER BY created desc limit ?, 3`;
        connection.query(sql, [userID, min], (err, topic) => {
            if (err) throw err;
            return callback(null, topic);
        })
    },
    userSubtopic: function (min, parent, callback) {
        const sql = `SELECT * FROM subtopic WHERE parent_id =? ORDER BY created desc limit ? ,3`;
        connection.query(sql, [parent, min], (err, subtopic) => {
            if (err) throw err;
            return callback(null, subtopic);
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
    subtopicList: function (parentID, callback) {
        const sql = 'SELECT * FROM subtopic WHERE parent_id = ? ORDER BY created';
        connection.query(sql, [parentID], (err, subtopicList) => {
            if (err) throw err;
            return callback(null, subtopicList);
        });
    },
    subtopic: function (subpageID, callback) {
        const sql = 'SELECT * FROM subtopic WHERE id = ?';
        connection.query(sql, [subpageID], (err, subtopic) => {
            if (err) throw err;
            return callback(null, subtopic);
        });
    },
    insertSubtopic: function (info) {
        const sql = 'INSERT INTO subtopic(id,title,description,parent_id,created) VALUES(?,?,?,?,NOW())';
        connection.query(sql, [info.id, info.title, info.description, info.parentID]);
    },
    updateSubtopic: function (info, callback) {
        const sql = 'UPDATE subtopic set title=?,description=?,created=NOW() WHERE id = ?';
        connection.query(sql, [info.title, info.description, info.id]
            , (this.subtopic(info.id, (err, subtopic) => {
                return callback(null, subtopic[0].parent_id);
            })));
    },
    deleteSubtopic: function (subtopicID) {
        const sql = 'DELETE FROM subtopic WHERE id = ?';
        connection.query(sql, [subtopicID]);
    },
    deleteUser: function (userID) {
        const sql = 'DELETE FROM user WHERE id = ?';
        connection.query(sql, [userID], deleteUserTopic(userID));
    },

    changePwdUser: function (newPwd, userID) {
        const sql = 'UPDATE user set pwd =? where id =?';
        connection.query(sql, [newPwd, userID]);
    }
}

function deleteUserTopic(userID) {
    selectUserTopic(userID, (err, parentID) => {
        for (var i = 0; i < parentID.length; i++) {
            deleteParentIDSubtopic(parentID[i].id);
        }
    });
    connection.query('DELETE FROM topic WHERE user_id =?', [userID]);
}
function selectUserTopic(userID, callback) {
    connection.query('SELECT id FROM topic WHERE user_id = ?', [userID], (err, topicID) => {
        if (err) throw err;
        return callback(null, topicID);
    });
}
function deleteParentIDSubtopic(parentID) {
    connection.query('DELETE FROM subtopic WHERE parent_id = ?', [parentID]);
}