const mariadb = require('mariadb');
let connection = null;

module.exports.connect = function() {
    return new Promise(function (resolve, reject) {
        let config  = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: "ichbinich",
            connectionLimit: 5
        };

        const pool = mariadb.createPool(config);
        pool.getConnection().then(conn => {
            connection = conn;
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
};

module.exports.query = function(query, param) {
    return new Promise(function (resolve, reject) {
        if(connection == null) {
            reject("No connection to database!");
        }
        connection.query(query, param).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};