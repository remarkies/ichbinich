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
                // get basket items
                const items = await paymentService.requestCheckOutItems(basketCookie.id);

                // get previous entered email
                const email = await paymentService.getEmailFromBasketId(basketCookie.id);

                // create params object for creating new stripe session
                const params = paymentService.buildParamsForItems(email, basketCookie.id, items);

                // let stripe create new session with params
                const session = await stripe.createSession(params);

                // save stripe session id to basket for later usage
                await basketService.updateBasketWithSession(basketCookie.id, session.id);

                return responseController.ok(response, {id: session.id});
            } else {
                // basket id not valid
                const message = 'Basket id not valid.';
                return responseController.fail(response, { error: message });
            }
        } else {
            // no cookie available
            const message = 'No cookie available.';
            return responseController.fail(response, { error: message });
        }
    } catch(error) {
        return responseController.fail(response, { error: error.message });
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
