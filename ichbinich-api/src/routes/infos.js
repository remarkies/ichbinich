let express = require('express');
let database = require('../services/DatabaseService');
let router = express.Router();

// return json object with all titles
router.get('/titles',function(request,response){

    // get all available titles
    database.query( `SELECT t.id, t.description FROM title t where t.language_id = 1;`, null).then((output) => {
        response.send(output);
    }).catch((err) => {
        let code = 'BACKEND ERROR. CODE 0004';
        console.log(code);
        console.log(err);
        response.send(code)
    });
});

// return json object with all countries
router.get('/countries',function(request,response){

    // get all available titles
    database.query( `SELECT c.id, c.name FROM country c;`, null).then((output) => {
        response.send(output);
    }).catch((err) => {
        let code = 'BACKEND ERROR. CODE 0004';
        console.log(code);
        console.log(err);
        response.send(code)
    });
});

module.exports = router;