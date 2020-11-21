const express = require('express');
const stripe = require('../services/stripeService');
const basketService = require('../services/basketService');
const paymentService = require('../services/paymentService');
const errorService = require('../services/errorService');

let router = express.Router();
router.post('/create-session', async (request,response) => {
    const basketCookie = request.body.basketCookie;

    // check if user has already basket
    if(basketCookie !== null) {
        // there should be a basket
        basketService.basketExists(basketCookie.id)
            .then(exists => {
                if(exists) {
                    // basket actually exists
                    paymentService.requestCheckOutItems(basketCookie.id)
                        .then(items => {
                            const params = paymentService.buildParamsForItems(basketCookie.id, items);

                            stripe.createSession(params).then(session => {
                                basketService.updateBasketWithSession(basketCookie.id, session.id)
                                    .then(() => {
                                        response.send({ id: session.id});
                                    })
                                    .catch(err => {
                                        // basket id not valid
                                        const message = '/create-session -> could not update basket with session.';
                                        errorService.newError(message, err);
                                        response.send(message)
                                    });

                            }).catch(err => {
                                // basket id not valid
                                const message = '/create-session -> could not create stripe session.';
                                errorService.newError(message, err);
                                response.send(message)
                            });
                        })
                        .catch(err => {
                            const message = '/create-session -> requestCheckOutItems failed.';
                            errorService.newError(message, err);
                            response.send(message)
                        });


                } else {
                    // basket id not valid
                    const message = '/create-session -> basket id not valid.';
                    errorService.newError(message, err);
                    response.send(message)
                }
            });
    } else {
        // no cookie available
        const message = '/create-session -> no cookie available.';
        errorService.newError(message, err);
        response.send(message)
    }
});
router.post('/confirm', async (request,response) => {
    const sessionId = request.body.stripe_session_id; //"cs_test_a1AYCOw8FHCFFefPuTMbdzCvqnD3ypuexJv1wDaUUerGDgHu3JWe6YZeJ7";

    stripe.getSession(sessionId)
        .then(result => {
            let responseObject = {
                payment_status: result.payment_status
            };
            response.send(responseObject);
        })
        .catch(err => {
            const message = '/confirm -> could not get stripe session.';
            errorService.newError(message, err);
            response.send(message)
        });
});

module.exports = router;