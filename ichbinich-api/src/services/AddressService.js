const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');

module.exports.requestAddressForBasket = function(basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectAddressForBasketId, [basketId])
            .then((output) => {
                let address = output[0];
                if(address !== undefined) {
                    resolve(address);
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                reject(new ErrorService.Error('Requesting address for basket id failed.', err));
            });
    });
};
module.exports.requestUserForAddress = function(addressId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectUserForBasketId, [addressId])
            .then((output) => {
                const user = output[0] === undefined? null : output[0];
                resolve(user);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Requesting user for address id failed.', err));
            });
    });
};
module.exports.upsertAddress = function(address, basketCookie) {
    return new Promise(((resolve, reject) => {
        this.addressIdForBasket(basketCookie.id)
            .then(addressId => {
                if(addressId !== null) {
                    address.id = addressId;
                    this.updateAddress(address)
                        .then(() => {
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    this.insertAddress(address)
                        .then(newAddressId => {
                            this.linkAddressToBasket(newAddressId, basketCookie.id)
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            })
            .catch(err => {
                reject(err);
            });
    }));
};
module.exports.upsertCustomerFromAddress = function(address, basketCookie) {
    return new Promise(((resolve, reject) => {
        this.customerIdForBasket(basketCookie.id)
            .then(customerId => {
                if(customerId !== null) {
                    this.updateCustomerFromAddress(address, customerId)
                        .then(() => {
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    this.insertCustomerFromAddress(address)
                        .then(newCustomerId => {
                            this.linkCustomerToBasket(newCustomerId, basketCookie.id)
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            })
            .catch(err => {
                reject(err);
            });
    }));
};
module.exports.insertAddress = function(address)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.InsertAddress, [address.addressType_id, address.title_id, address.firstName, address.lastName, address.street, address.streetNo, address.postalCode, address.city, address.country_id])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Inserting address failed.', err));
            });
    });
};
module.exports.updateAddress = function(address)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.UpdateAddress, [address.addressType_id, address.title_id, address.firstName, address.lastName, address.street, address.streetNo, address.postalCode, address.city, address.country_id, address.id])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(new ErrorService.Error('Updating address failed.', err));
            });
    });
};
module.exports.insertCustomerFromAddress = function(address)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.InsertCustomerFromAddress, [address.email, address.phone])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Inserting customer from address failed.', err));
            });
    });
};
module.exports.updateCustomerFromAddress = function(address, customer_id)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.UpdateCustomerFromAddress, [address.email, address.phone, customer_id])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(new ErrorService.Error('Updating customer from address failed.', err));
            });
    });
};
module.exports.addressIdForBasket = function(basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectAddressIdForBasketId, [basketId])
            .then((output) => {
                const addressId = output[0] === undefined ? null : output[0].address_id;
                resolve(addressId);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Getting address id for basket id failed.', err));
            });
    });
};
module.exports.customerIdForBasket = function(basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.SelectCustomerIdForBasketId, [basketId])
            .then((output) => {
                const customerId = output[0] === undefined ? null : output[0].customer_id;
                resolve(customerId);
            })
            .catch((err) => {
                reject(new ErrorService.Error('Getting customer id for basket id failed.', err));
            });
    });
};
module.exports.linkAddressToBasket = function(addressId, basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.UpdateLinkAddressToBasket, [addressId, basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(new ErrorService.Error('Linking address to basket failed.', err));
            });
    });
};
module.exports.linkCustomerToBasket = function(customerId, basketId)  {
    return new Promise((resolve, reject) => {
        DatabaseService.query(QueryService.UpdateLinkCustomerToBasket, [customerId, basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(new ErrorService.Error('Linking customer to basket failed.', err));
            });
    });
};