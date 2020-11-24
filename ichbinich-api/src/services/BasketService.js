const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');
const PaintingService = require('./PaintingService');

module.exports.basketExists = function(id)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectBasketExists, [id])
            .then((output) => {
                const basketFound = output[0].basketFound === 0 ? false : true;
                resolve(basketFound);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Check if basket ' + id + ' exists failed.', err));
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

                DatabaseService.query(QueryService.SelectBasketItems, [id])
                    .then(result => {
                        let hasValues = result[0] === undefined ? false : true;

                        if(hasValues) {
                            const ids = result.map(row => row.id );
                            PaintingService.loadPaintings(ids)
                                .then(paintings => {
                                    resultObject.items = paintings;
                                    resolve(resultObject);
                                })
                                .catch(err => {
                                    reject(new ErrorService.Error('Could not request old basket. Load paintings failed.', err));
                                });
                        } else {
                            resolve(resultObject);
                        }

                    })
                    .catch(err => {
                        reject(new ErrorService.Error('Could not request old basket. Check if basket item failed.', err));
                    });
            })
            .catch(err => {
                reject(new ErrorService.Error('Could not request old basket. Loading stripe session id from basket failed.', err));
            });

    });
};
module.exports.requestNewBasket = function()  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.InsertNewBasket, null)
            .then((output) => {
                let resultObject = {
                    id: output.insertId,
                    stripe_session_id: null,
                    items: []
                };
                resolve(resultObject);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Could not request new basket.', err));
            });
    });
};
module.exports.getStripeSessionIdFromBasket = function(id)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectStripeSessionIdFromBasket, [id])
            .then(result => {
                const stripeSessionId = result[0] === undefined ? null : result[0].stripe_session_id;
                resolve(stripeSessionId);
            })
            .catch(err => {
                reject(new ErrorService.Error('Could not get stripe session id from basket.', err));
            });
    });
};
module.exports.addPaintingToBasket = function(basketId, paintingId)  {
    return new Promise((resolve, reject) => {
        this.paintingExistsInBasket(basketId, paintingId)
            .then(exists => {
                if(!exists) {
                    DatabaseService.query(QueryService.InsertPaintingToBasket, [basketId, paintingId])
                        .then((output) => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(new ErrorService.Error('Could not insert painting to basket.', err));
                        });
                } else {
                    reject(new ErrorService.Error('Painting already exists in basket.', ''));
                }
            })
            .catch(err => {
                reject(new ErrorService.Error('Could check if painting exists in basket.', err));
            });

    });
};
module.exports.removePaintingFromBasket = function(basketId, paintingId)  {
    return new Promise((resolve, reject) => {
        this.paintingExistsInBasket(basketId, paintingId)
            .then(exists => {
                if(exists) {
                    DatabaseService.query(QueryService.DeleteBasketItem, [basketId, paintingId])
                        .then((output) => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject(new ErrorService.Error('There is no painting to remove.', {}));
                }
            })
            .catch(err => {
                reject(new ErrorService.Error('Could not remove painting from basket.', err));
            });
    });
};
module.exports.paintingExistsInBasket = function(basketId, paintingId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectBasketItemExists, [basketId, paintingId])
            .then((output) => {
                const exists = output[0].paintingFound === 0 ? false : true;
                resolve(exists);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Check if painting exists in basket failed.', err));
            });
    });
};
module.exports.updateBasketWithSession = function(basketId, sessionId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.UpdateStripeSessionIdInBasket, [sessionId, basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(new ErrorService.Error('Could not update basket with session.', err));
            });
    });
};
module.exports.clearBasketFromItems = function(basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.DeleteBasketItems, [basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(new ErrorService.Error('Could not basket items.', err));
            });
    });
};