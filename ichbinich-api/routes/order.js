const express = require('express');
const orderService = require('../services/orderService');
const stripe = require('../services/stripeService');
const basketService = require('../services/basketService');
const paymentService = require('../services/paymentService');
const errorService = require('../services/errorService');

let router = express.Router();
router.post('/submit', async (request,response) => {
    const sessionId = request.body.stripe_session_id;
    orderService.submitOrder(sessionId)
        .then(() => {
            response.send({});
        });

});

module.exports = router;