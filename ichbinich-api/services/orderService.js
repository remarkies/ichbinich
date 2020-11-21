const database = require('../services/database');
const basketService = require('../services/basketService');

module.exports.submitOrder = function(sessionId)  {
    return new Promise((resolve, reject) => {
        this.getBasketIdFromSession(sessionId)
            .then(basketId => {
                this.getDataForOrder(sessionId)
                    .then(orderData => {
                        this.insertOrder(orderData.customer_id, orderData.address_id, sessionId)
                            .then(orderId => {
                                this.getOrderItemsFromSession(sessionId)
                                    .then(orderItems => {
                                        let promises = [];

                                        orderItems.forEach(orderItem => {
                                            promises.push(this.insertOrderItem(orderId, orderItem.painting_id))
                                        });

                                        Promise.all(promises)
                                            .then(() => {
                                                basketService.clearBasketFromItems(basketId)
                                                    .then(() => {
                                                        basketService.updateBasketWithSession(basketId, null)
                                                            .then(() => {
                                                                resolve();
                                                            })
                                                            .catch(err => { reject(err); });
                                                    })
                                                    .catch(err => { reject(err); });
                                            })
                                            .catch(err => { reject(err); });
                                    })
                                    .catch(err => { reject(err); });
                            })
                            .catch(err => { reject(err); });
                    })
                    .catch(err => { reject(err); });
            })
            .catch(err => { reject(err); });
    });
};
module.exports.getBasketIdFromSession = function(sessionId)  {
    return new Promise((resolve, reject) => {
        database.query('select b.id from basket b where b.stripe_session_id = ?;', [sessionId])
            .then((output) => {
                const basketId = output[0] === undefined ? null : output[0];
                resolve(basketId.id);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.getDataForOrder = function(sessionId)  {
    return new Promise((resolve, reject) => {
        database.query(`select b.customer_id, b.address_id from basket b where b.stripe_session_id = ?;`, [sessionId])
            .then((output) => {
                const orderData = output[0] === undefined ? null : output[0];
                resolve(orderData);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.getOrderItemsFromSession = function(sessionId)  {
    return new Promise((resolve, reject) => {
        database.query(`select bp.painting_id from basket_painting bp
                                join basket b on bp.basket_id = b.id
                                where b.stripe_session_id = ?;`, [sessionId])
            .then((output) => {
                const orderItems = output[0] === undefined ? [] : output;
                resolve(orderItems);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.insertOrder = function(customerId, address_id, sessionId)  {
    return new Promise((resolve, reject) => {
        database.query(`insert into \`order\` (customer_id, orderDateTime, orderAddress_id, billingAddress_id, orderState_id, employee_id, changeDateTime, stripe_session_id)
                                VALUES (?, ?, ?, ?, 1, null, null, ?);`, [customerId, new Date(), address_id, address_id, sessionId])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.insertOrderItem = function(orderId, paintingId)  {
    return new Promise((resolve, reject) => {
        database.query(`insert into order_painting (order_id, painting_id) VALUES (?, ?);`, [orderId, paintingId])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
