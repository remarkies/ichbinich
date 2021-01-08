const mariadb = require('mariadb');
const errorService = require('./ErrorService');
let connection = null;

module.exports.connect = async function() {
    console.log('connect');
    try {
        let config  = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: "ichbinich",
            connectionLimit: 150
        };

        connection = await mariadb.createPool(config).getConnection();
    } catch(error) {
        throw new errorService.Error('Function: connect. Could not connect to database.', error);
    }
};

module.exports.query = async function(query, param) {
    try {
        if (connection === null) {
            console.log('New mariadb connection');
            await this.connect();
        }
        let res = connection.query(query, param);

        connection.release();

        return await res;
    } catch (error) {
        throw error;
    } finally {
        if (connection !== null) {
            connection.release();
        }
    }
};
