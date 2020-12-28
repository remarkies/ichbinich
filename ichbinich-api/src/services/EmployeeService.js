const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const EmailService = require('./EmailService');

module.exports.login = async function(username) {
    let employees = await DatabaseService.query(QueryService.SelectEmployeeWithUsername, [username]);

    if (employees.length === 0) {
        return null;
    } else {
        return employees[0];
    }
}

module.exports.saveTokenForId = async function(token, id) {
    return await DatabaseService.query(QueryService.UpdateTokenForId, [token, id]);
}
module.exports.isTokenValid = async function(token) {
    const result = await DatabaseService.query(QueryService.SelectIsTokenValid, [token]);
    return result[0].isValid > 0;
}
module.exports.getOrders = async function() {
    let result = await DatabaseService.query(QueryService.SelectEmployeeOrders, null);
    for (const order of result) {
        order.items = await DatabaseService.query(QueryService.SelectEmployeeOrderItems, [order.id])
    }

    return result;
}

module.exports.getOrder = async function(id) {
    let result = await DatabaseService.query(QueryService.SelectEmployeeOrder, [id]);
    for (const order of result) {
        order.items = await DatabaseService.query(QueryService.SelectEmployeeOrderItems, [order.id])
    }

    if (result.length > 0) {
        return result[0];
    }

    return result;
}

module.exports.markOrderAsSent = async function(orderId) {
    return await DatabaseService.query(QueryService.UpdateMarkOrderAsSent, [orderId]);
}

module.exports.sendCustomerOrderSentMail = async function(email) {
    let newLine = '\n';
    let header = 'Statusänderung Ihrer Bestellung';
    let text =  'Sehr geehrter Kunde,' + newLine + newLine +
        'Ihre Bestellung wurde verschickt.';

    text += newLine + 'Email Adresse: shop@ichbinich.ch' + newLine + newLine +
        'Freundliche Grüsse' + newLine +
        'ichbinich.ch'

    let mailOption = EmailService.createEmailOptions(email, header, text);
    await EmailService.sendEmail(mailOption);
}
