// PaintingService
module.exports.SelectLoadPaintings = `SELECT P.ID 'id', P.name, P.style_id, S.description 'style', p.technique_id, t.description 'technique',
                                    P.underground_id, U.description 'underground', P.height, P.width, P.depth, P.price, P.collection_id,
                                    C.name 'collection', P.series_id, SE.name 'series', 
                                   (select count(*) from order_painting op
                                                    where op.painting_id = p.id) 'sold'
                            FROM PAINTING P
                             JOIN style S ON P.style_id = S.id
                             JOIN technique t on P.technique_id = t.id
                             join underground u on P.underground_id = u.id
                             LEFT JOIN collection C ON P.collection_id = C.id
                             LEFT JOIN series SE ON P.series_id = SE.id;`;
module.exports.SelectLoadPathsForPainting = `SELECT I.path FROM painting_image PI
                                    JOIN IMAGE I ON PI.image_id = I.id
                                    WHERE PI.painting_id = ?;`;
module.exports.SelectLoadPaintingsWithParams = `SELECT P.ID 'id',
                                   P.name,
                                   P.style_id,
                                   S.description 'style',
                                   p.technique_id,
                                   t.description 'technique',
                                   P.underground_id,
                                   U.description 'underground',
                                   P.height,
                                   P.width,
                                   P.depth,
                                   P.price,
                                   P.collection_id,
                                   C.name        'collection',
                                   P.series_id,
                                   SE.name       'series', 
                                   (select count(*) from order_painting op
                                                    where op.painting_id = p.id) 'sold'
                            FROM PAINTING P
                                     JOIN style S ON P.style_id = S.id
                                     JOIN technique t on P.technique_id = t.id
                                     join underground u on P.underground_id = u.id
                                     LEFT JOIN collection C ON P.collection_id = C.id
                                     LEFT JOIN series SE ON P.series_id = SE.id
                            WHERE P.ID IN (?);`;

// BasketService
module.exports.SelectBasketExists = `select count(*) 'basketFound' from basket b where b.id = ?;`;
module.exports.SelectBasketItems = `select bp.painting_id id from basket_painting bp where bp.basket_id = ?;`;
module.exports.InsertNewBasket = `insert into basket (customer_id) values (null);`;
module.exports.SelectStripeSessionIdFromBasket = `select b.stripe_session_id from basket b where b.id = ?;`;
module.exports.InsertPaintingToBasket = `insert into basket_painting (basket_id, painting_id) values (?, ?);`;
module.exports.DeleteBasketItem = `delete from basket_painting where basket_id = ? and painting_id = ?;`;
module.exports.SelectBasketItemExists = `select count(*) 'paintingFound' from basket_painting bp where bp.basket_id = ? and bp.painting_id = ?;`;
module.exports.UpdateStripeSessionIdInBasket = `update basket set stripe_session_id = ? where id = ?;`;
module.exports.DeleteBasketItems = `delete from basket_painting where basket_id = ?;`;

// PaymentService
module.exports.SelectCheckoutItems = `select p.id, p.name, p.price, (select i.path from painting_image pi
                                    join image i on pi.image_id = i.id
                                    where pi.painting_id = p.id limit 0,1) 'path' from basket b
                                join basket_painting bp on b.id = bp.basket_id
                                join painting p on bp.painting_id = p.id
                                where bp.basket_id = ?;`

// OrderService
module.exports.SelectBasketIdFromStripeSessionId = `select b.id from basket b where b.stripe_session_id = ?;`
module.exports.SelectDataForOrder = `select b.customer_id, b.address_id from basket b where b.stripe_session_id = ?;`;
module.exports.SelectOrderItemsFromStripeSessionId = `select bp.painting_id from basket_painting bp
                                join basket b on bp.basket_id = b.id
                                where b.stripe_session_id = ?;`;
module.exports.InsertOrder = `insert into \`order\` (customer_id, orderDateTime, orderAddress_id, billingAddress_id, orderState_id, employee_id, changeDateTime, stripe_session_id)
                                VALUES (?, ?, ?, ?, 1, null, null, ?);`;
module.exports.InsertOrderItem = `insert into order_painting (order_id, painting_id) VALUES (?, ?);`;

// AddressService
module.exports.SelectAddressForBasketId = `select a.*, c.email, c.phone, t.description 'title', c2.name 'country' from basket b
                                    left join address a on b.address_id = a.id
                                    join title t on a.title_id = t.id
                                    join country c2 on a.country_id = c2.id
                                    left join customer c on b.customer_id = c.id
                                    where b.id = ?;`
module.exports.SelectUserForBasketId = `select c.email, c.phone from customer c
                                join customer_address ca on c.id = ca.customer_id
                                where ca.address_id = ?;`;
module.exports.InsertAddress = `insert into address (addressType_id, title_id, firstName, lastName, street, streetNo, postalCode, city, country_id)
                                values(?, ?, ?, ?, ?, ?, ?, ?, ?);`;
module.exports.UpdateAddress = `update address set addressType_id = ?, title_id = ?, firstName = ?, lastName = ?, street = ?, streetNo = ?, postalCode = ?, city = ?, country_id = ?
                                where id = ?;`;
module.exports.InsertCustomerFromAddress = `insert into customer (email, password, phone, language_id) VALUES (?, null, ?, 1);`;
module.exports.UpdateCustomerFromAddress = `update customer set email = ?, phone = ? where id = ?;`;
module.exports.SelectAddressIdForBasketId = `select b.address_id from basket b where b.id = ?;`
module.exports.SelectCustomerIdForBasketId = `select b.customer_id from basket b where b.id = ?;`;
module.exports.UpdateLinkAddressToBasket = `update basket set address_id = ? where id = ?;`;
module.exports.UpdateLinkCustomerToBasket = `update basket set customer_id = ? where id = ?;`;

module.exports.SelectOrderPositions = `select p.name, p.price from order_painting op
join \`order\` o on op.order_id = o.id
join painting p on op.painting_id = p.id
where o.stripe_session_id = ?;`
module.exports.SelectOrderInfo = `select
        o.id,
       (select sum(p.price) from order_painting op
       join painting p on op.painting_id = p.id
       where op.order_id = o.id) 'orderTotal',
       o.orderDateTime,
       c.email, t.description 'title', a.firstName, a.lastName, a.street, a.streetNo, a.postalCode, a.city, c2.name 'country'
from \`order\` o
join customer c on o.customer_id = c.id
join address a on o.orderAddress_id = a.id
join title t on a.title_id = t.id
join country c2 on a.country_id = c2.id
where o.stripe_session_id = ?`;
module.exports.SelectEmployees = `select e.email from employee e;`;
