const express = require('express');
const BasketService = require('../services/BasketService');
const responseController = require('../controllers/ResponseController');

let router = express.Router();

router.post('/request', async (request,response, next) => {
    const basketCookie = request.body.basketCookie;

    // check if user has already basket
    if(basketCookie !== null) {
        // there should be a basket
        BasketService.basketExists(basketCookie.id)
            .then(exists => {
                if(exists) {
                    // basket actually exists
                    BasketService.requestOldBasket(basketCookie.id)
                        .then(oldBasket => {
                            response.send(oldBasket);
                        })
                        .catch((err) => {
                            next(err);
                        });
                } else {
                    // basket id not valid
                    BasketService.requestNewBasket()
                        .then(newBasket => {
                            response.send(newBasket);
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            });
    } else {
        // no cookie available
        BasketService.requestNewBasket()
            .then(newBasket => {
                response.send(newBasket);
            })
            .catch((err) => {
                next(err);
        });
    }
});
router.post('/add', async (request,response, next) => {
    const basketId = request.body.basketId;
    const paintingId = request.body.paintingId;

    BasketService.addPaintingToBasket(basketId, paintingId)
        .then(result => {
            response.send(result);
        })
        .catch(err => {
            next(err);
        });
});
router.post('/remove', async (request,response, next) => {
    const basketId = request.body.basketId;
    const paintingId = request.body.paintingId;

    BasketService.removePaintingFromBasket(basketId, paintingId)
        .then(result => {
            response.send(result);
        })
        .catch(err => {
            next(err);
        });
});

router.post('/itemExists', async (request,response, next) => {
    const basketId = request.body.basketId;
    const paintingId = request.body.paintingId;

    const exists = await BasketService.paintingExistsInBasket(basketId, paintingId);

    return responseController.ok(response, exists);
});


module.exports = router;
