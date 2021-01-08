const databaseService = require('./DatabaseService');
const queryService = require('./QueryService');
const errorService = require('./ErrorService');

module.exports.requestCheckOutItems = async function(basketId)  {
    return databaseService.query(queryService.SelectCheckoutItems, [basketId]);
};

module.exports.buildParamsForItems = function(email, basketId, items)  {
    let params = {
        payment_method_types: ['card'],
        line_items: [],
        mode: 'payment',
        customer_email: email,
        client_reference_id: basketId,
        success_url: `${process.env.STRIPE_SUCCESS_URL}?success=true`,
        cancel_url: `${process.env.STRIPE_CANCEL_URL}?canceled=true`,
        metadata: {
            paintings: items.map(item => item.id).join().toString()
        }
    };

    items.forEach(item => {
        params.line_items.push({
            price_data: {
                currency: 'chf',
                product_data: {
                    name: item.name,
                    images: ['https://api.ichbinich.ch/public/images/' + item.path]
                },
                unit_amount_decimal: (item.price * 100),
            },
            quantity: 1,
        });
    });

    return params;
};

module.exports.getEmailFromBasketId = async function(basketId) {
    try {
        const result = await databaseService.query(queryService.SelectEmailFromBasketId, [basketId]);
        return result[0].email;
    } catch (error) {
        throw new errorService.Error('Function: isOrderAlreadySubmitted. Database query failed.', error);
    }
}

