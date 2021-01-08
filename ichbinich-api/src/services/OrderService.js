const moment = require('moment');
const databaseService = require('./DatabaseService');
const basketService = require('./BasketService');
const queryService = require('./QueryService');
const emailService = require('./EmailService');
const errorService = require('./ErrorService');
const stripeService = require('./StripeService');

module.exports.isOrderAlreadySubmitted = async function(sessionId) {
  try {
      const result = await databaseService.query(queryService.SelectSessionIdExistsInOrder, [sessionId]);

      return result[0].sessionIdExists > 0;
  } catch (error) {
      throw new errorService.Error('Function: isOrderAlreadySubmitted. Database query failed.', error);
  }
};

module.exports.submitOrder = async function(sessionId)  {

    // get basket from session id
    const basketId = await this.getBasketIdFromSession(sessionId);

    // get customer and address data from session id
    const orderData = await this.getDataForOrder(sessionId);

    // create new order in database (includes writing stripe session id to order table)
    const orderId = await this.insertOrder(orderData.customer_id, orderData.address_id, sessionId);

    // get order items from stripe payment
    // resolves issue where user could change basket while paying
    const paintingIds = await this.getOrderItemsFromStripe(sessionId);

    for (const paintingId of paintingIds) {
        // create new order position in database
        // connect order position to order
        await this.insertOrderItem(orderId, paintingId);
    }

    // remove items from basket
    // user will be using same basket
    // nice because user wont need to reenter customer data on next purchase
    // user data is saved to basket
    await basketService.clearBasketFromItems(basketId);

    // remove stripe session id from basket
    await basketService.updateBasketWithSession(basketId, null);
};

module.exports.getBasketIdFromSession = async function(sessionId)  {
    try {
        const result = await databaseService.query(queryService.SelectBasketIdFromStripeSessionId, [sessionId]);
        return result[0] === undefined ? null : result[0].id;
    } catch (error) {
        throw new errorService.Error('Function: getBasketIdFromSession. Database query failed.', error);
    }
};

module.exports.getDataForOrder = async function(sessionId)  {
    try {
        const result = await databaseService.query(queryService.SelectDataForOrder, [sessionId]);
        return result[0] === undefined ? null : result[0];
    } catch(error) {
        throw new errorService.Error('Function: getDataForOrder. Database query failed.', error);
    }
};

module.exports.getOrderItemsFromSession = async function(sessionId)  {
    try {
        const result = await databaseService.query(queryService.SelectOrderItemsFromStripeSessionId, [sessionId]);
        return result[0] === undefined ? [] : result;
    } catch(error) {
        throw new errorService.Error('Function: getOrderItemsFromSession. Database query failed.', error);
    }
};

module.exports.getOrderItemsFromStripe = async function(sessionId) {
    try {
        const session = await stripeService.getSession(sessionId);

        return session.metadata.paintings.split(',').map(painting => parseInt(painting));
    } catch(error) {
        throw new errorService.Error('Function: getOrderItemsFromStripe failed.', error);
    }
}

module.exports.insertOrder = async function(customerId, address_id, sessionId)  {
    try {
        const result = await databaseService.query(queryService.InsertOrder,[customerId, new Date(), address_id, address_id, sessionId]);
        return result.insertId;
    } catch(error) {
        throw new errorService.Error('Function: insertOrder. Database query failed.', error);
    }
};

module.exports.insertOrderItem = async function(orderId, paintingId)  {
    try {
        const result = await databaseService.query(queryService.InsertOrderItem, [orderId, paintingId]);
        return result.insertId
    } catch(error) {
        throw new errorService.Error('Function: insertOrderItem. Database query failed.', error);
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
