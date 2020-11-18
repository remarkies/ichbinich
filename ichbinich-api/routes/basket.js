let express = require('express');
let database = require('../services/database');
let basketService = require('../services/basketService');
let paintingService = require('../services/paintingService')
let errorService = require('../services/errorService')

let router = express.Router();

// return json object with all titles
router.post('/request', async (request,response) => {
    const basketCookie = request.body.basketCookie;

    // check if user has already basket
    if(basketCookie !== null) {
        // there should be a basket
        basketService.basketExists(basketCookie.id)
            .then(exists => {
                if(exists) {
                    // basket actually exists
                    basketService.requestOldBasket(basketCookie.id)
                        .then(oldBasket => {
                            response.send(oldBasket);
                        })
                        .catch((err) => {
                        const message = 'basketService.requestOldBasket failed.';
                        errorService.newError(message, err);
                        response.send(message)
                    });;
                } else {
                    // basket id not valid
                    basketService.requestNewBasket()
                        .then(newBasket => {
                            response.send(newBasket);
                        })
                        .catch((err) => {
                            const message = 'basketService.requestNewBasket failed. (cookie)';
                            errorService.newError(message, err);
                            response.send(message)
                        });
                }
            });
    } else {
        // no cookie available
        basketService.requestNewBasket()
            .then(newBasket => {
                response.send(newBasket);
            })
            .catch((err) => {
                const message = 'basketService.requestNewBasket failed. (no cookie)';
                errorService.newError(message, err);
                response.send(message)
        });
    }
});

router.post('/add', async (request,response) => {
    const basketId = request.body.basketId;
    const paintingId = request.body.paintingId;

    basketService.addPaintingToBasket(basketId, paintingId)
        .then(result => {
            response.send(result);
        })
        .catch(err => {
            const message = 'paintings.addPaintingToBasket() failed.';
            errorService.newError(message, err);
            response.send(message)
        });
});


module.exports = router;