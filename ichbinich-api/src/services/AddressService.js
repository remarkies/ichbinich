const databaseService = require('./DatabaseService');
const queryService = require('./QueryService');
const errorService = require('./ErrorService');

module.exports.requestAddressForBasket = async function(basketId)  {
    try {
        const results = await databaseService.query(queryService.SelectAddressForBasketId, [basketId])
        return results[0] === undefined ? null : results[0];
    } catch(error) {
        throw new errorService.newError('Function: requestAddressForBasket. Database query failed.', error);
    }
};

module.exports.requestUserForAddress = async function(addressId)  {
    try {
        const result = await databaseService.query(queryService.SelectUserForBasketId, [addressId]);
        return result[0] === undefined ? null : result[0];
    } catch(error) {
        throw new errorService.newError('Function: requestUserForAddress. Database query failed.', error);
    }
};

module.exports.upsertAddress = async function(address, basketCookie) {
    try {
        const addressId = await this.addressIdForBasket(basketCookie.id);

        if (addressId !== null) {
            address.id = addressId;
            await this.updateAddress(address);
        } else {
            const newAddressId = await this.insertAddress(address);
            await this.linkAddressToBasket(newAddressId, basketCookie.id);
        }
    } catch(error) {
        throw new errorService.newError('Function: upsertAddress failed.', error);
    }
};

module.exports.upsertCustomerFromAddress = async function(address, basketCookie) {
    try {
        const customerId = await this.customerIdForBasket(basketCookie.id);

        if (customerId !== null) {
            await this.updateCustomerFromAddress(address, customerId);
        } else {
            const newCustomerId = await this.insertCustomerFromAddress(address);
            await this.linkCustomerToBasket(newCustomerId, basketCookie.id);
        }
    } catch(error) {
        throw new errorService.newError('Function: upsertCustomerFromAddress failed.', error);
    }
};

module.exports.insertAddress = async function(address)  {
    try {
        const result = await databaseService.query(queryService.InsertAddress, [
            address.addressType_id,
            address.title_id,
            address.firstName,
            address.lastName,
            address.street,
            address.postalCode,
            address.city,
            address.country_id,
            address.company]);

        return result.insertId;
    } catch (error) {
        throw new errorService.newError('Function: insertAddress failed.', error);
    }
};

module.exports.updateAddress = async function(address)  {
    try {
        await databaseService.query(queryService.UpdateAddress, [
            address.addressType_id,
            address.title_id,
            address.firstName,
            address.lastName,
            address.street,
            address.postalCode,
            address.city,
            address.country_id,
            address.company,
            address.id]);
    } catch (error) {
        throw new errorService.newError('Function: updateAddress failed.', error);
    }
};

module.exports.insertCustomerFromAddress = async function(address)  {
    try {
        const result = await databaseService.query(queryService.InsertCustomerFromAddress, [address.email, address.phone]);
        return result.insertId;
    } catch (error) {
        throw new errorService.newError('Function: insertCustomerFromAddress failed.', error);
    }
};

module.exports.updateCustomerFromAddress = async function(address, customer_id)  {
    try {
        await databaseService.query(queryService.UpdateCustomerFromAddress, [address.email, address.phone, customer_id]);
    } catch(error) {
        throw new errorService.newError('Function: updateCustomerFromAddress failed.', error);
    }
};

module.exports.addressIdForBasket = async function(basketId)  {
    try {
        const results = await databaseService.query(queryService.SelectAddressIdForBasketId, [basketId]);
        return results[0] === undefined ? null : results[0].address_id;
    } catch(error) {
        throw new errorService.newError('Function: addressIdForBasket failed.', error);
    }
};

module.exports.customerIdForBasket = async function(basketId)  {
    try {
        const results = await databaseService.query(queryService.SelectCustomerIdForBasketId, [basketId]);
        return results[0] === undefined ? null : results[0].customer_id;
    } catch(error) {
        throw new errorService.newError('Function: customerIdForBasket failed.', error);
    }
};

module.exports.linkAddressToBasket = async function(addressId, basketId)  {
    try {
        await databaseService.query(queryService.UpdateLinkAddressToBasket, [addressId, basketId]);
    } catch(error) {
        throw new errorService.newError('Function: linkAddressToBasket failed.', error);
    }
};

module.exports.linkCustomerToBasket = async function(customerId, basketId)  {
    try {
        await databaseService.query(queryService.UpdateLinkCustomerToBasket, [customerId, basketId]);
    } catch(error) {
        throw new errorService.newError('Function: linkCustomerToBasket failed.', error);
    }
};

module.exports.getTitles = async function() {
    let titles;

    try {
        titles = await databaseService.query(queryService.SelectTitles, null);
    } catch(error) {
        throw new errorService.newError('Function: getTitles. Database query failed.', error);
    }

    return titles;
};

module.exports.getCountries = async function() {
    let countries;

    try {
        countries = await databaseService.query(queryService.SelectCountries, null);
    } catch(error) {
        throw new errorService.newError('Function: getCountries. Database query failed.', error);
    }

    return countries;
};
