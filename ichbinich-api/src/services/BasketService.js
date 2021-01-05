const databaseService = require('./DatabaseService');
const queryService = require('./QueryService');
const paintingService = require('./PaintingService');
const errorService = require('./ErrorService');

module.exports.basketExists = async function(id)  {
    try {
        const results = await databaseService.query(queryService.SelectBasketExists, [id]);

        return results[0].basketFound !== 0;
    } catch (error) {
        throw new errorService.Error('Function: basketExists. Database query failed');
    }
};

module.exports.requestOldBasket = async function(id)  {

    let resultObject = {
        id: id,
        items: []
    };

    try {
        resultObject.stripe_session_id = await this.getStripeSessionIdFromBasket(id);
    } catch (error) {
        throw new errorService.Error('Function: requestOldBasket. Could not get stripe session id from basket');
    }

    let results;

    try {
        results = await databaseService.query(queryService.SelectBasketItems, [id]);
    } catch (error) {
        throw new errorService.Error('Function: requestOldBasket. Could not get old basket items.');
    }

    if(results.length > 0) {
        const ids = results.map(row => row.id );

        try {
            resultObject.items = await paintingService.getPaintings(ids);
        } catch (error) {
            throw new errorService.Error('Function: requestOldBasket. Could not get paintings for old basket items.');
        }
    }

    return resultObject;
};

module.exports.requestNewBasket = async function()  {
    try {
        const result = await databaseService.query(queryService.InsertNewBasket, null);

        return {
            id: result.insertId,
            stripe_session_id: null,
            items: []
        };
    } catch (error) {
        throw new errorService.Error('Function: requestNewBasket. Database query failed');
    }
};

module.exports.getStripeSessionIdFromBasket = async function(id)  {
    try {
        const result = await databaseService.query(queryService.SelectStripeSessionIdFromBasket, [id]);
        return result[0] === undefined ? null : result[0].stripe_session_id;
    } catch (error) {
        throw new errorService.Error('Function: getStripeSessionIdFromBasket. Database query failed');
    }
};

module.exports.addPaintingToBasket = async function(basketId, paintingId)  {
    try {
        const exists = await this.paintingExistsInBasket(basketId, paintingId);

        if (!exists) {
            await databaseService.query(queryService.InsertPaintingToBasket, [basketId, paintingId])
        }
    } catch (error) {
        throw new errorService.Error('Function: addPaintingToBasket. Database query failed');
    }
};

module.exports.removePaintingFromBasket = async function(basketId, paintingId)  {
    try {
        const exists = await this.paintingExistsInBasket(basketId, paintingId);

        if (exists) {
            await databaseService.query(queryService.DeleteBasketItem, [basketId, paintingId]);
        }
    } catch (error) {
        throw new errorService.Error('Function: removePaintingFromBasket. Database query failed');
    }
};

module.exports.paintingExistsInBasket = async function(basketId, paintingId)  {
    try {
        const results = await databaseService.query(queryService.SelectBasketItemExists, [basketId, paintingId]);
        return results[0].paintingFound !== 0;
    } catch(error) {
        throw new errorService.Error('Function: paintingExistsInBasket. Database query failed');
    }
};

module.exports.updateBasketWithSession = async function(basketId, sessionId)  {
    try {
        await databaseService.query(queryService.UpdateStripeSessionIdInBasket, [sessionId, basketId]);
    } catch(error) {
        throw new errorService.Error('Function: updateBasketWithSession. Database query failed');
    }
};

module.exports.clearBasketFromItems = async function(basketId)  {
    try {
        await databaseService.query(queryService.DeleteBasketItems, [basketId]);
    } catch (error) {
        throw new errorService.Error('Function: clearBasketFromItems. Database query failed');
    }
};
