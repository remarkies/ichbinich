const moment = require('moment');

const DatabaseService = require('./DatabaseService');
const BasketService = require('./BasketService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');
const EmailService = require('./EmailService');

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
                                                BasketService.clearBasketFromItems(basketId)
                                                    .then(() => {
                                                        BasketService.updateBasketWithSession(basketId, null)
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
        DatabaseService.query(QueryService.SelectBasketIdFromStripeSessionId, [sessionId])
            .then((output) => {
                const basketId = output[0] === undefined ? null : output[0];
                resolve(basketId.id);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Getting basket id from session id failed.', err));
            });
    });
};
module.exports.getDataForOrder = function(sessionId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectDataForOrder, [sessionId])
            .then((output) => {
                const orderData = output[0] === undefined ? null : output[0];
                resolve(orderData);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Getting data for order failed.', err));
            });
    });
};
module.exports.getOrderItemsFromSession = function(sessionId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectOrderItemsFromStripeSessionId, [sessionId])
            .then((output) => {
                const orderItems = output[0] === undefined ? [] : output;
                resolve(orderItems);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Getting order items from session id failed.', err));
            });
    });
};
module.exports.insertOrder = function(customerId, address_id, sessionId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.InsertOrder,[customerId, new Date(), address_id, address_id, sessionId])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Insert order failed.', err));
            });
    });
};
module.exports.insertOrderItem = function(orderId, paintingId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.InsertOrderItem, [orderId, paintingId])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Insert order item failed.', err));
            });
    });
};
module.exports.sendMailsForOrder = async function(sessionId)  {
    let orderInfo = await DatabaseService.query(QueryService.SelectOrderInfo, [sessionId]);
    let orderPositions = await DatabaseService.query(QueryService.SelectOrderPositions, [sessionId]);

    await this.sendCustomerMail(orderInfo[0], orderPositions);

    let employees = await DatabaseService.query(QueryService.SelectEmployees, null);

    for (const employee of employees) {
        await this.sendEmployeeMail(employee, orderInfo[0], orderPositions);
    }
};

module.exports.sendCustomerMail = async function(orderInfo, orderPositions) {
    let newLine = '\n';
    let header = 'Bestellbestätigung';
    let text =  'Sehr geehrter Kunde,' + newLine + newLine +
                'Vielen Dank für Ihre Bestellung, wir werden diese umgehend bearbeiten.' + newLine + newLine+
                'Bestellpositionen: ' + newLine;

    orderPositions.forEach(position => {
       text += position.name + ' - CHF ' + position.price + '.-' + newLine + newLine;
    });

    text += 'Email Adresse: shop@ichbinich.ch' + newLine + newLine +
                    'Freundliche Grüsse' + newLine +
                    'ichbinich.ch'

    let mailOption = EmailService.createEmailOptions(orderInfo.email, header, text);
    await EmailService.sendEmail(mailOption);
}
module.exports.sendEmployeeMail = async function(employee, orderInfo, orderPositions) {
    let newLine = '\n';
    let header = 'Bestellung: ' + orderInfo.id;
    let text =  'Neue Bestellung auf ichbinich.ch!' + newLine + newLine +
        'Bestelldatum: ' + moment(orderInfo.orderDateTime).format('DD.MMMM.YYYY, HH:mm:ss') + newLine + newLine +
        'Bestellpositionen: ' + newLine;

    orderPositions.forEach(position => {
        text += position.name + ' - CHF ' + position.price + '.-' + newLine;
    });

    let mailOption = EmailService.createEmailOptions(employee.email, header, text);
    await EmailService.sendEmail(mailOption);
}
