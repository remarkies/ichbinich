const express = require('express');
const basketService = require('../services/BasketService');
const responseController = require('../controllers/ResponseController');

const router = express.Router();

router.post('/request', async (request,response, next) => {
    try {
        const basketCookie = request.body.basketCookie;

        // check if user has already basket
        if(basketCookie !== null) {

            // there should be a basket
            const exists = await basketService.basketExists(basketCookie.id);

            if(exists) {

                // basket actually exists
                const oldBasket = await basketService.requestOldBasket(basketCookie.id);
                return responseController.ok(response, oldBasket);
            }
        }

        // no cookie available or id not valid
        const newBasket = await basketService.requestNewBasket();
        return responseController.ok(response, newBasket);

    } catch (error) {
        return responseController.fail(response, error.message);
    }
});

router.post('/add', async (request,response, next) => {
    try {
        const basketId = request.body.basketId;
        const paintingId = request.body.paintingId;

        const result = await basketService.addPaintingToBasket(basketId, paintingId);

        return responseController.ok(response, result);
    } catch(error) {
        return responseController.fail(response, error.message);
    }
});

router.post('/remove', async (request,response, next) => {
    try {
        const basketId = request.body.basketId;
        const paintingId = request.body.paintingId;

        const result = await basketService.removePaintingFromBasket(basketId, paintingId);
        return responseController.ok(response, result);
    } catch (error) {
        return responseController.fail(response, error.message);
    }
});

router.post('/itemExists', async (request,response, next) => {
    try {
        const basketId = request.body.basketId;
        const paintingId = request.body.paintingId;

        const exists = await basketService.paintingExistsInBasket(basketId, paintingId);

        return responseController.ok(response, exists);
    } catch (error) {
        return responseController.fail(response, error.message);
    }
});

module.exports = router;
