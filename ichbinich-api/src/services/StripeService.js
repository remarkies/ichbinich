const StripeService = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.createSession = async function(params) {
    return StripeService.checkout.sessions.create(params);
};

module.exports.getSession = async function(sessionId) {
    return StripeService.checkout.sessions.retrieve(sessionId);
};
