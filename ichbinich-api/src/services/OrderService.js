const moment = require('moment');
const databaseService = require('./DatabaseService');
const basketService = require('./BasketService');
const queryService = require('./QueryService');
const emailService = require('./EmailService');
const errorService = require('./ErrorService');

module.exports.isOrderAlreadySubmitted = async function(sessionId) {
  try {
      const result = await databaseService.query(queryService.SelectSessionIdExistsInBasket, [sessionId]);
      return result[0].sessionIdExists === 0;
  } catch (error) {
      throw new errorService.newError('Function: isOrderAlreadySubmitted. Database query failed.', error);
  }
};

module.exports.submitOrder = async function(sessionId)  {
    const basketId = await this.getBasketIdFromSession(sessionId);
    const orderData = await this.getDataForOrder(sessionId);
    const orderId = await this.insertOrder(orderData.customer_id, orderData.address_id, sessionId);
    const orderItems = await this.getOrderItemsFromSession(sessionId);

    for (const orderItem of orderItems) {
        await this.insertOrderItem(orderId, orderItem.painting_id);
    }

    await basketService.clearBasketFromItems(basketId);
    await basketService.updateBasketWithSession(basketId, null);
};

module.exports.getBasketIdFromSession = async function(sessionId)  {
    try {
        const result = await databaseService.query(queryService.SelectBasketIdFromStripeSessionId, [sessionId]);
        return result[0] === undefined ? null : result[0].id;
    } catch (error) {
        throw new errorService.newError('Function: getBasketIdFromSession. Database query failed.', error);
    }
};

module.exports.getDataForOrder = async function(sessionId)  {
    try {
        const result = await databaseService.query(queryService.SelectDataForOrder, [sessionId]);
        return result[0] === undefined ? null : result[0];
    } catch(error) {
        throw new errorService.newError('Function: getDataForOrder. Database query failed.', error);
    }
};

module.exports.getOrderItemsFromSession = async function(sessionId)  {
    try {
        const result = await databaseService.query(queryService.SelectOrderItemsFromStripeSessionId, [sessionId]);
        return result[0] === undefined ? [] : result;
    } catch(error) {
        throw new errorService.newError('Function: getOrderItemsFromSession. Database query failed.', error);
    }
};

module.exports.insertOrder = async function(customerId, address_id, sessionId)  {
    try {
        const result = await databaseService.query(queryService.InsertOrder,[customerId, new Date(), address_id, address_id, sessionId]);
        return result.insertId;
    } catch(error) {
        throw new errorService.newError('Function: insertOrder. Database query failed.', error);
    }
};

module.exports.insertOrderItem = async function(orderId, paintingId)  {
    try {
        const result = await databaseService.query(queryService.InsertOrderItem, [orderId, paintingId]);
        return result.insertId
    } catch(error) {
        throw new errorService.newError('Function: insertOrderItem. Database query failed.', error);
    }
};

module.exports.sendMailsForOrder = async function(sessionId)  {
    const orderInfo = await databaseService.query(queryService.SelectOrderInfo, [sessionId]);
    const orderPositions = await databaseService.query(queryService.SelectOrderPositions, [sessionId]);

    await this.sendCustomerMail(orderInfo[0], orderPositions);

    const employees = await databaseService.query(queryService.SelectEmployees, null);

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
       text += position.name + ' - CHF ' + position.price + '.-' + newLine;
    });

    text += newLine + 'Email Adresse: shop@ichbinich.ch' + newLine + newLine +
                    'Freundliche Grüsse' + newLine +
                    'ichbinich.ch'

    let mailOption = emailService.createEmailOptions(orderInfo.email, header, text);
    await emailService.sendEmail(mailOption);
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

    let mailOption = emailService.createEmailOptions(employee.email, header, text);
    await emailService.sendEmail(mailOption);
}
