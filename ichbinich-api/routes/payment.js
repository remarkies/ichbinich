let express = require('express');
let database = require('../services/database');
let paintingService = require('../services/paintingService');
let stripe = require('../services/stripeService');

let router = express.Router();
router.post('/create-session', async (request,response) => {
    let items = request.body.items;

    // get paintings from database
    database.query( `SELECT P.ID 'id',
               P.name,
               P.price
        FROM PAINTING P
        WHERE P.ID IN (?);`, [items]).then((output) => {

        // create promises for getting all images foreach painting
        // includes images in json object of paintings
        let promises = paintingService.getPaths(output);

        // execute promises
        // then send response with json
        Promise.all(promises).then(() => {

            let params = {
                payment_method_types: ['card'],
                line_items: [],
                mode: 'payment',
                success_url: `${process.env.STRIPE_SUCCESS_URL}?success=true`,
                cancel_url: `${process.env.STRIPE_CANCEL_URL}?canceled=true`,
            };

            output.forEach(item => {
                params.line_items.push({
                    price_data: {
                        currency: 'chf',
                        product_data: {
                            name: item.name,
                            images: ['https://i.imgur.com/EHyR2nP.png']
                        },
                        unit_amount_decimal: (item.price * 100),
                    },
                    quantity: 1,
                });
            });

            stripe.createSession(params).then(session => {
                response.send({ id: session.id});
            }).catch(error => {
                let code = 'BACKEND ERROR. CREATE_SESSION: Creating session.';
                console.log(code);
                console.log(error);
                // just during dev time
                response.send(error);
            });
        });

    }).catch((err) => {
        let code = 'BACKEND ERROR. CREATE_SESSION: Receive payment relevant data from database.';
        console.log(code);
        console.log(err);
        response.send(code)
    });
});

// return json object with all paintings
router.get('/',function(request,response){

    let defaultPayment = {
        amount: 1000,
        currency: 'chf',
        payment_method_types: ['card'],
        receipt_email: 'luka@ichbinich.ch',
    };

    stripe.createPaymentIntent(defaultPayment).then(output => {
        response.send(output);
    });
});

module.exports = router;