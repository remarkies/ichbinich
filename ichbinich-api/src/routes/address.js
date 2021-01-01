let express = require('express');
let basketService = require('../services/BasketService');
let addressService = require('../services/AddressService');
const responseController = require('../controllers/ResponseController');

const router = express.Router();

router.post('/request', async (request,response) => {
    try {
        const basketCookie = request.body.basketCookie;

        // check if user has already basket
        if (basketCookie !== null) {
            // there should be a basket
            const exists = await basketService.basketExists(basketCookie.id);

            if (exists) {
                // basket actually exists
                const address = await addressService.requestAddressForBasket(basketCookie.id);
                return responseController.ok(response, {address: address, status: 0});
            } else {
                // basket id not valid
                return responseController.fail(response, {address: null, status: 1, message: "basket id invalid."});
            }
        } else {
            // no cookie available
            return responseController.fail(response, {address: null, status: 0, message: ""});
        }
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.post('/new', async (request,response) => {
    try {
        const basketCookie = request.body.basketCookie;
        let address = request.body.address;

        //currently only supporting one address for ordering
        address.addressType_id = 1;
        // check if user has already basket
        if (basketCookie !== null) {
            // there should be a basket
            const basketExists = await basketService.basketExists(basketCookie.id);
            if (basketExists) {
                // basket actually exists
                await addressService.upsertAddress(address, basketCookie);
                await addressService.upsertCustomerFromAddress(address, basketCookie);
                return responseController.ok(response, {});
            } else {
                // basket id not valid
                const message = '/new -> cookie not valid. Cant update address.';
                return responseController.fail(response, message);
            }
        } else {
            // no cookie available
            const message = '/new -> no cookie. Cant update address.';
            return responseController.fail(response, message);
        }
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.get('/countries',async function(request,response){
    try {
        // get all available countries of paintings
        const countries = await addressService.getCountries();

        return responseController.ok(response, countries);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.get('/titles',async function(request,response){
    try {
        // get all available titles of paintings
        const titles = await addressService.getTitles();

        return responseController.ok(response, titles);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

module.exports = router;
