let database = require('../services/database');

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