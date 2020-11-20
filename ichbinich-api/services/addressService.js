let database = require('../services/database');
let errorService = require('../services/errorService');
module.exports.requestAddressForBasket = function(basketId)  {
    return new Promise((resolve, reject) => {
        database.query(`select a.*, c.email, c.phone, t.description 'title', c2.name 'country' from basket b
                                    left join address a on b.address_id = a.id
                                    join title t on a.title_id = t.id
                                    join country c2 on a.country_id = c2.id
                                    left join customer c on b.customer_id = c.id
                                    where b.id = ?;`, [basketId])
            .then((output) => {
                let address = output[0];
                if(address !== undefined) {
                    resolve(address);
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.requestUserForAddress = function(addressId)  {
    return new Promise((resolve, reject) => {
        database.query(`select c.email, c.phone from customer c
                                join customer_address ca on c.id = ca.customer_id
                                where ca.address_id = ?;`, [addressId])
            .then((output) => {
                const user = output[0] === undefined? null : output[0];
                resolve(user);
            })
            .catch((err) => {
                reject(err);
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
                console.log('customerid', customerId);
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
        database.query(`insert into address (addressType_id, title_id, firstName, lastName, street, streetNo, postalCode, city, country_id)
                                values(?, ?, ?, ?, ?, ?, ?, ?, ?);`, [address.addressType_id, address.title_id, address.firstName, address.lastName, address.street, address.streetNo, address.postalCode, address.city, address.country_id])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.updateAddress = function(address)  {
    return new Promise((resolve, reject) => {
        database.query(`update address set addressType_id = ?, title_id = ?, firstName = ?, lastName = ?, street = ?, streetNo = ?, postalCode = ?, city = ?, country_id = ?
                                where id = ?;`, [address.addressType_id, address.title_id, address.firstName, address.lastName, address.street, address.streetNo, address.postalCode, address.city, address.country_id, address.id])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.insertCustomerFromAddress = function(address)  {
    return new Promise((resolve, reject) => {
        database.query(`insert into customer (email, password, phone, language_id) VALUES (?, null, ?, 1);`, [address.email, address.phone])
            .then((output) => {
                resolve(output.insertId);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.updateCustomerFromAddress = function(address, customer_id)  {
    return new Promise((resolve, reject) => {
        database.query(`update customer set email = ?, phone = ? where id = ?;`, [address.email, address.phone, customer_id])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.addressIdForBasket = function(basketId)  {
    return new Promise((resolve, reject) => {
        database.query(`select b.address_id from basket b where b.id = ?;`, [basketId])
            .then((output) => {
                const addressId = output[0] === undefined ? null : output[0].address_id;
                resolve(addressId);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.customerIdForBasket = function(basketId)  {
    return new Promise((resolve, reject) => {
        database.query(`select b.customer_id from basket b where b.id = ?;`, [basketId])
            .then((output) => {
                const customerId = output[0] === undefined ? null : output[0].customer_id;
                resolve(customerId);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.linkAddressToBasket = function(addressId, basketId)  {
    return new Promise((resolve, reject) => {
        database.query(`update basket set address_id = ?
                                        where id = ?;`, [addressId, basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};
module.exports.linkCustomerToBasket = function(customerId, basketId)  {
    return new Promise((resolve, reject) => {
        database.query(`update basket set customer_id = ?
                                        where id = ?;`, [addressId, basketId])
            .then((output) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};