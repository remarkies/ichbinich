const express = require('express');
const orderService = require('../services/OrderService');
const responseController = require('../controllers/ResponseController');
const stripe = require('../services/StripeService');
const basketService = require('../services/BasketService');
const paymentService = require('../services/PaymentService');
const errorService = require('../services/ErrorService');

let router = express.Router();
router.post('/submit', async (request,response) => {
    const sessionId = request.body.stripe_session_id;
    
    try {
        await orderService.submitOrder(sessionId);
    } catch (err) {
        return responseController.fail(response, "Submit order failed. Error: " + err);
    }

    try {

    } catch (err) {
        return responseController.fail(response, "Send mails for order failed. Error: " + err);
    }

    return responseController.ok(response, null);
});

module.exports = router;