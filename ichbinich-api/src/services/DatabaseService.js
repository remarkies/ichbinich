const mariadb = require('mariadb');
const errorService = require('./ErrorService');
let pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "ichbinich",
    connectionLimit: 5
});

module.exports.query = async function(query, param) {
    let conn;
    try {
        // get new connection from pool
        conn = await pool.getConnection();

        // set up query
        const res = conn.query(query, param);

        // release connection
        await conn.release();

        // await for query result and return
        return await res;
    } catch (error) {
        throw error;
    } finally {
        // close connection
        if (conn) await conn.end();
    }
};
