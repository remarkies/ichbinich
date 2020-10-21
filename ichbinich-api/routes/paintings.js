let express = require('express');
let database = require('../services/database');
let router = express.Router();

// return json object with all paintings
router.get('/',function(request,response){

    // get paintings from database
    database.query( `SELECT P.ID,
               P.name,
               P.style_id,
               S.description 'STYLE',
               p.technique_id,
               t.description 'TECHNIQUE',
               P.underground_id,
               U.description 'UNDERGROUND',
               P.height,
               P.width,
               P.depth,
               P.price,
               P.collection_id,
               C.name        'COLLECTION',
               P.series_id,
               SE.name       'SERIES'
        FROM PAINTING P
                 JOIN style S ON P.style_id = S.id
                 JOIN technique t on P.technique_id = t.id
                 join underground u on P.underground_id = u.id
                 LEFT JOIN collection C ON P.collection_id = C.id
                 LEFT JOIN series SE ON P.series_id = SE.id;`, null).then((output) => {

        let promises = [];

        // create promises for getting all images foreach painting
        // includes images in json object of paintings
        output.forEach((painting) => {
            promises.push(new Promise((resolve, reject) => {
                database.query(`SELECT I.path
                    FROM painting_image PI
                             JOIN IMAGE I ON PI.image_id = I.id
                    WHERE PI.painting_id = ?;`, [painting.ID]).then((paths) => {
                    output.find(x => x.ID === painting.ID).paths = paths;
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }));
        });

        // execute promises
        // then send response with json
        Promise.all(promises).then(() => {
            response.send(output)
        });

    }).catch((err) => {
        console.log(err);
        response.send('BACKEND ERROR. CODE 0001')
    });
});

module.exports = router;