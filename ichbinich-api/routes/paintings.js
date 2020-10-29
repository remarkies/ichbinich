let express = require('express');
let database = require('../services/database');
let router = express.Router();

// return json object with all paintings
router.get('/',function(request,response){

    // get paintings from database
    database.query( `SELECT P.ID 'id',
               P.name,
               P.style_id,
               S.description 'style',
               p.technique_id,
               t.description 'technique',
               P.underground_id,
               U.description 'underground',
               P.height,
               P.width,
               P.depth,
               P.price,
               P.collection_id,
               C.name        'collection',
               P.series_id,
               SE.name       'series'
        FROM PAINTING P
                 JOIN style S ON P.style_id = S.id
                 JOIN technique t on P.technique_id = t.id
                 join underground u on P.underground_id = u.id
                 LEFT JOIN collection C ON P.collection_id = C.id
                 LEFT JOIN series SE ON P.series_id = SE.id;`, null).then((output) => {

        // create promises for getting all images foreach painting
        // includes images in json object of paintings
        let promises = getPathsForPaintings(output);

        // execute promises
        // then send response with json
        Promise.all(promises).then(() => {
            response.send(output)
        });

    }).catch((err) => {
        let code = 'BACKEND ERROR. CODE 0001';
        console.log(code);
        console.log(err);
        response.send(code)
    });
});

router.post('/:ids', function(request,response) {
    let ids = request.body.ids;

    if(ids === undefined || ids.length === 0) {
        response.send([]);
        return;
    }

    // get paintings from database
    database.query( `SELECT P.ID 'id',
               P.name,
               P.style_id,
               S.description 'style',
               p.technique_id,
               t.description 'technique',
               P.underground_id,
               U.description 'underground',
               P.height,
               P.width,
               P.depth,
               P.price,
               P.collection_id,
               C.name        'collection',
               P.series_id,
               SE.name       'series'
        FROM PAINTING P
                 JOIN style S ON P.style_id = S.id
                 JOIN technique t on P.technique_id = t.id
                 join underground u on P.underground_id = u.id
                 LEFT JOIN collection C ON P.collection_id = C.id
                 LEFT JOIN series SE ON P.series_id = SE.id
        WHERE P.ID IN (?);`, [ids]).then((output) => {

        // create promises for getting all images foreach painting
        // includes images in json object of paintings
        let promises = getPathsForPaintings(output);

        // execute promises
        // then send response with json
        Promise.all(promises).then(() => {
            response.send(output);
        });

    }).catch((err) => {
        let code = 'BACKEND ERROR. CODE 0002';
        console.log(code);
        console.log(err);
        response.send(code)
    });
});

function getPaintings() {

}
function getPaintings(ids) {
}
function getPathsForPaintings(paintings) {
    let promises = [];
    paintings.forEach((painting) => {
        promises.push(new Promise((resolve, reject) => {
            getPathsForId(painting.id).then((paths) => {
                paintings.find(x => x.id === painting.id).paths = paths;
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }));
    });
    return promises;
}
function getPathsForId(id) {
    return database.query(`SELECT I.path
                    FROM painting_image PI
                             JOIN IMAGE I ON PI.image_id = I.id
                    WHERE PI.painting_id = ?;`, [id])
}


module.exports = router;