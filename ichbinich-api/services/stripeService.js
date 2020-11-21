const stripeService = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.createSession = function(params) {
    return new Promise(function (resolve, reject) {
        stripeService.checkout.sessions.create(params).then(session => {
            resolve(session);
        }).catch(error => {
            reject(error);
        });
    });
};

module.exports.getSession = function(sessionId) {
    return stripeService.checkout.sessions.retrieve(sessionId);
};

