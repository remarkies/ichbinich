require('dotenv').config();
const hashService = require('./src/services/HashService');
const database = require('./src/services/DatabaseService');

createEmploye('luka@ichbinich.ch', 'remarkies', 'test123');
createEmploye('luka.kramer@stud.hslu.ch', 'tropeluc', 'test123');

async function createEmploye(email, username, password) {

    await database.connect();

    // hash password
    let hashedPwd = await hashService.hash(password);

    let exists = await database.query(`select count(*) 'exists' from employee e
                                        where e.email = ? or e.username = ?;`, [email, username])

    if (exists[0].exists === 0) {

        // create entry
        await database.query(`INSERT INTO employee (email, username, password)
                            VALUES (?, ?, ?);`, [email, username, hashedPwd]);

        console.log('User created!');
    } else {
        console.log('User already exists!');
    }
}
