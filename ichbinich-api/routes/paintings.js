let express = require('express');
let database = require('../services/database');
let router = express.Router();

// return json object with all paintings
router.get('/',function(request,response){

    // get paintings from database
    database.query("SELECT P.ID,\n" +
        "       P.name,\n" +
        "       P.style_id,\n" +
        "       S.description 'style',\n" +
        "       p.technique_id,\n" +
        "       t.description 'technique',\n" +
        "       P.underground_id,\n" +
        "       U.description 'underground',\n" +
        "       P.height,\n" +
        "       P.width,\n" +
        "       P.depth,\n" +
        "       P.price,\n" +
        "       P.collection_id,\n" +
        "       C.name        'collection',\n" +
        "       P.series_id,\n" +
        "       SE.name       'series'\n" +
        "FROM PAINTING P\n" +
        "         JOIN style S ON P.style_id = S.id\n" +
        "         JOIN technique t on P.technique_id = t.id\n" +
        "         join underground u on P.underground_id = u.id\n" +
        "         LEFT JOIN collection C ON P.collection_id = C.id\n" +
        "         LEFT JOIN series SE ON P.series_id = SE.id;", null).then((output) => {

        let promises = [];

        // create promises for getting all images foreach painting
        // includes images in json object of paintings
        output.forEach((painting) => {
            promises.push(new Promise((resolve, reject) => {
                database.query("SELECT I.path\n" +
                    "FROM painting_image PI\n" +
                    "         JOIN IMAGE I ON PI.image_id = I.id\n" +
                    "WHERE PI.painting_id = ?;", [painting.ID]).then((paths) => {
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