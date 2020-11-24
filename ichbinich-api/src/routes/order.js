const express = require('express');
const orderService = require('../services/OrderService');
const stripe = require('../services/StripeService');
const basketService = require('../services/BasketService');
const paymentService = require('../services/PaymentService');
const errorService = require('../services/ErrorService');

let router = express.Router();
router.post('/submit', async (request,response) => {
    const sessionId = request.body.stripe_session_id;
    orderService.submitOrder(sessionId)
        .then(() => {
            response.send({});
        });

});

module.exports = router;