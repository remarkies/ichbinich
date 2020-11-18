const database = require('../services/database');

module.exports.requestPaintings = function()  {
    return new Promise((resolve, reject) => {
        database.query(`SELECT P.ID 'id',
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
                                     LEFT JOIN series SE ON P.series_id = SE.id;`, null)
            .then((output) => {
            // create promises for getting all images foreach painting
            // includes images in json object of paintings
            let promises = this.getPaths(output);

            Promise.all(promises).then(() => {
                resolve(output);
            });
        })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports.requestPaintingsWithParams = function(ids)  {
    return new Promise((resolve, reject) => {
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
                let promises = this.getPaths(output);

                Promise.all(promises).then(() => {
                    resolve(output);
                });
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports.getPaths = function(paintings)  {
    let promises = [];
    paintings.forEach((painting) => {
        promises.push(new Promise((resolve, reject) => {
            database.query(`SELECT I.path FROM painting_image PI
                                    JOIN IMAGE I ON PI.image_id = I.id
                                    WHERE PI.painting_id = ?;`, [painting.id])
                .then((paths) => {
                    paintings.find(x => x.id === painting.id).paths = paths;
                    resolve();
            }).catch((err) => {
                reject(err);
            });
        }));
    });
    return promises;
};