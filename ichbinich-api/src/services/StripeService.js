const StripeService = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ErrorService = require('./ErrorService');

module.exports.createSession = function(params) {
    return new Promise(function (resolve, reject) {
        StripeService.checkout.sessions.create(params).then(session => {
            resolve(session);
        }).catch(err => {
            reject(new ErrorService.Error('Creating stripe session failed.', err));
        });
    });
};
module.exports.getSession = function(sessionId) {
    return StripeService.checkout.sessions.retrieve(sessionId);
};

