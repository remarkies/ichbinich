const express = require('express')
require('dotenv').config()
const app = express()
const port = 3000

let database = require('./services/database');
database.connect().then(function () {
    console.log('connected');
});

app.get('/', (req, res) => {

    database.query("select * from employee;", null).then((output) => {
        console.log(output);
    });
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})