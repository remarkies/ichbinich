let database = require('../services/database');
let paintingService = require('../services/paintingService')

module.exports.basketExists = function(id)  {
    return new Promise((resolve, reject) => {
        database.query('select count(*) \'basketFound\' from basket b where b.id = ?;', [id])
            .then((output) => {
                const basketFound = output[0].basketFound === 0 ? false : true;
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

        this.getStripeSessionIdFromBasket(id)
            .then(stripeSessionId => {
                resultObject.stripe_session_id = stripeSessionId;

                database.query(`select bp.painting_id id from basket_painting bp where bp.basket_id = ?;`, [id])
                    .then(result => {
                        let hasValues = result[0] === undefined ? false : true;

                        if(hasValues) {
                            const ids = result.map(row => row.id );
                            paintingService.requestPaintingsWithParams(ids)
                                .then(paintings => {
                                    resultObject.items = paintings;
                                    resolve(resultObject);
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        } else {
                            resolve(resultObject);
                        }

                    })
                    .catch(err => {
                        reject(err);
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
                    stripe_session_id: null,
                    items: []
                };
                resolve(resultObject);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.getStripeSessionIdFromBasket = function(id)  {
    return new Promise((resolve, reject) => {
        database.query(`select b.stripe_session_id from basket b where b.id = ?;`, [id])
            .then(result => {
                const stripeSessionId = result[0] === undefined ? null : result[0].stripe_session_id;
                resolve(stripeSessionId);
            })
            .catch(err => {
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
                            resolve();
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
module.exports.removePaintingFromBasket = function(basketId, paintingId)  {
    return new Promise((resolve, reject) => {
        this.paintingExistsInBasket(basketId, paintingId)
            .then(exists => {
                if(exists) {
                    database.query('delete from basket_painting where basket_id = ? and painting_id = ?;', [basketId, paintingId])
                        .then((output) => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject("There is no painting to remove!");
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
                const exists = output[0].paintingFound === 0 ? false : true;
                resolve(exists);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.updateBasketWithSession = function(basketId, sessionId)  {
    return new Promise((resolve, reject) => {
        database.query('update basket set stripe_session_id = ? where id = ?;', [sessionId, basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.clearBasketFromItems = function(basketId)  {
    return new Promise((resolve, reject) => {
        database.query('delete from basket_painting where basket_id = ?;', [basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};