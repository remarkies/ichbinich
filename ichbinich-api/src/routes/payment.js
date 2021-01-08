const express = require('express');
const stripe = require('../services/StripeService');
const basketService = require('../services/BasketService');
const paymentService = require('../services/PaymentService');
const responseController = require('../controllers/ResponseController');

const router = express.Router();

router.post('/create-session', async (request,response) => {
    try {
        const basketCookie = request.body.basketCookie;

        // check if user has already basket
        if (basketCookie !== null) {
            // there should be a basket
            const exists = await basketService.basketExists(basketCookie.id);

            if (exists) {
                // basket actually exists
                const items = await paymentService.requestCheckOutItems(basketCookie.id);

                const email = await paymentService.getEmailFromBasketId(basketCookie.id);

                const params = paymentService.buildParamsForItems(email, basketCookie.id, items);

                const session = await stripe.createSession(params);
                await basketService.updateBasketWithSession(basketCookie.id, session.id);

                return responseController.ok(response, {id: session.id});
            } else {
                // basket id not valid
                const message = '/create-session -> basket id not valid.';
                return responseController.fail(response, message);
            }
        } else {
            // no cookie available
            const message = '/create-session -> no cookie available.';
            return responseController.fail(response, message);
        }
    } catch(error) {
        return responseController.fail(response, error.message);
    }
});

router.post('/confirm', async (request,response) => {
    try {
        const sessionId = request.body.stripe_session_id;

        const result = await stripe.getSession(sessionId);

        let responseObject = {
            payment_status: result.payment_status
        };

        return responseController.ok(response, responseObject);
    } catch(error) {
        return responseController.fail(response, error.message);
    }
});

module.exports = router;
