let express = require('express');
let basketService = require('../services/BasketService');
let addressService = require('../services/AddressService');
let errorService = require('../services/ErrorService')

let router = express.Router();

router.post('/request', async (request,response) => {
    const basketCookie = request.body.basketCookie;
    //console.log('api call: /address, user: ', basketCookie.id);
    // check if user has already basket
    if(basketCookie !== null) {
        // there should be a basket
        basketService.basketExists(basketCookie.id)
            .then(exists => {
                if(exists) {
                    // basket actually exists
                    addressService.requestAddressForBasket(basketCookie.id)
                        .then(address => {
                            response.send({ address: address, status: 0});
                        })
                        .catch((err) => {
                            const message = 'basketService.requestAddressForBasket failed.';
                            errorService.newError(message, err);
                            response.send({ address: null, status: 1, message: message});
                        });
                } else {
                    // basket id not valid
                    response.send({ address: null, status: 1, message: "basket id invalid."});
                }
            });
    } else {
        // no cookie available
        response.send({ address: null, status: 0, message: ""});
    }
});
router.post('/new', async (request,response) => {
    const basketCookie = request.body.basketCookie;
    let address = request.body.address;

    //currently only supporting one address for ordering
    address.addressType_id = 1;
    // check if user has already basket
    if(basketCookie !== null) {
        // there should be a basket
        basketService.basketExists(basketCookie.id)
            .then(basketExists => {
                if(basketExists) {
                    // basket actually exists
                    Promise.all([
                        addressService.upsertAddress(address, basketCookie),
                        addressService.upsertCustomerFromAddress(address, basketCookie)
                    ]).then(() => {
                        response.send({});
                    });
                } else {
                    // basket id not valid
                    const message = '/new -> cookie not valid. Cant update address.';
                    errorService.newError(message, err);
                    response.send(message)
                }
            })
            .catch(err => {
                const message = '/new -> basketService.basketExists failed. (cookie)';
                errorService.newError(message, err);
                response.send(message)
            });
    } else {
        // no cookie available
        const message = '/new -> no cookie. Cant update address.';
        errorService.newError(message, err);
        response.send(message)
    }
});


module.exports = router;