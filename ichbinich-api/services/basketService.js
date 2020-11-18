let database = require('../services/database');
let paintingService = require('../services/paintingService')

module.exports.basketExists = function(id)  {
    return new Promise((resolve, reject) => {
        database.query('select count(*) \'basketFound\' from basket b where b.id = ?;', [id])
            .then((output) => {
                const basketFound = output[0].basketFound === 0 ? true : false;
                resolve(basketFound);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.requestOldBasket = function(id)  {
    return new Promise((resolve, reject) => {
        let resultObject = {
            id: id,
            items: []
        };

        database.query(`select bp.painting_id from basket_painting bp where bp.basket_id = ?;`, [id])
            .then(paintingIds => {
                paintingService.requestPaintingsWithParams(paintingIds)
                    .then(paintings => {
                        resultObject.items = paintings;
                        resolve(resultObject);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
};
module.exports.requestNewBasket = function()  {
    return new Promise((resolve, reject) => {
        database.query( `insert into basket (customer_id) values (null);`, null)
            .then((output) => {
                let resultObject = {
                    id: output.insertId,
                    items: []
                };
                resolve(resultObject);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.addPaintingToBasket = function(basketId, paintingId)  {
    return new Promise((resolve, reject) => {
        this.paintingExistsInBasket(basketId, paintingId)
            .then(exists => {
                if(!exists) {
                    database.query('insert into basket_painting (basket_id, painting_id) values (?, ?);', [basketId, paintingId])
                        .then((output) => {
                            const basketFound = output[0].basketFound === 0 ? true : false;
                            resolve(basketFound);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject("Painting already exists in basket!");
                }
            })
            .catch(err => {
                reject(err);
            });

    });
};
module.exports.paintingExistsInBasket = function(basketId, paintingId)  {
    return new Promise((resolve, reject) => {
        database.query('select count(*) \'paintingFound\' from basket_painting bp where bp.basket_id = ? and bp.painting_id = ?;', [basketId, paintingId])
            .then((output) => {
                const basketFound = output[0].paintingFound === 0 ? true : false;
                resolve(basketFound);
            })
            .catch((err) => {
                reject(err);
            });
    });
};