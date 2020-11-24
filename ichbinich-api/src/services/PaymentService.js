const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');

module.exports.requestCheckOutItems = function(basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectCheckoutItems, [basketId])
            .then((output) => {
                let items = output[0] === undefined ? [] : output;
                resolve(items);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Request checkout items failed.', err));
            });
    });
};
module.exports.buildParamsForItems = function(basketId, items)  {
    let params = {
        payment_method_types: ['card'],
        line_items: [],
        mode: 'payment',
        client_reference_id: basketId,
        success_url: `${process.env.STRIPE_SUCCESS_URL}?success=true`,
        cancel_url: `${process.env.STRIPE_CANCEL_URL}?canceled=true`,
    };

    items.forEach(item => {
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

    return params;
};


