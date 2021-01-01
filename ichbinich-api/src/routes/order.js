const express = require('express');
const orderService = require('../services/OrderService');
const responseController = require('../controllers/ResponseController');

const router = express.Router();

router.post('/submit', async (request,response) => {
    const sessionId = request.body.stripe_session_id;
    try {
        const alreadySubmitted = await orderService.isOrderAlreadySubmitted(sessionId);

        if (!alreadySubmitted) {
            await orderService.submitOrder(sessionId);

            try {
                await orderService.sendMailsForOrder(sessionId);
            } catch (err) {
                return responseController.fail(response, "Send mails for order failed. Error: " + err);
            }
        }
    } catch (err) {
        return responseController.fail(response, "Submit order failed. Error: " + err);
    }

    return responseController.ok(response, {});
});

router.post('/isOrderSubmitted', async (request,response) => {
    const sessionId = request.body.stripe_session_id;

    try {
        const alreadySubmitted = await orderService.isOrderAlreadySubmitted(sessionId);

        return responseController.ok(response, { submitted: alreadySubmitted });
    } catch (err) {
        return responseController.fail(response, "Check if order is submitted failed: " + err);
    }
});

module.exports = router;
