const database = require('../services/database');

module.exports.requestCheckOutItems = function(basketId)  {
    return new Promise((resolve, reject) => {
        database.query(`select p.id, p.name, p.price, (select i.path from painting_image pi
                                    join image i on pi.image_id = i.id
                                    where pi.painting_id = p.id limit 0,1) 'path' from basket b
                                join basket_painting bp on b.id = bp.basket_id
                                join painting p on bp.painting_id = p.id
                                where bp.basket_id = ?;`, [basketId])
            .then((output) => {
                let items = output[0] === undefined ? [] : output;
                resolve(items);
            })
            .catch((err) => {
                reject(err);
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



