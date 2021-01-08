// PaintingService
module.exports.SelectGetPaintings = `SELECT p.ID                          'id',
       p.name,
       p.style_id,
       s.description                 'style',
       p.technique_id,
       t.description                 'technique',
       p.underground_id,
       u.description                 'underground',
       p.height,
       p.width,
       p.description,
       p.year,
       p.price,
       p.collection_id,
       c.name                        'collection',
       p.series_id,
       se.name                       'series',
       (select count(*)
        from order_painting op
        where op.painting_id = p.id) 'sold'
FROM painting p
         JOIN style s ON p.style_id = s.id
         JOIN technique t on p.technique_id = t.id
         join underground u on p.underground_id = u.id
         LEFT JOIN collection c ON p.collection_id = c.id
         LEFT JOIN series se ON p.series_id = se.id;`;
module.exports.SelectGetPathsForPainting = `SELECT i.id, i.path FROM painting_image pi
                                    JOIN image i ON pi.image_id = i.id
                                    WHERE pi.painting_id = ?;`;
module.exports.SelectGetPainting = `SELECT p.ID 'id',
                                   p.name,
                                   p.style_id,
                                   s.description 'style',
                                   p.technique_id,
                                   t.description 'technique',
                                   p.underground_id,
                                   u.description 'underground',
                                   p.height,
                                   p.width,
                                   p.description,
                                   p.year,
                                   p.price,
                                   p.collection_id,
                                   c.name        'collection',
                                   p.series_id,
                                   se.name       'series', 
                                   (select count(*) from order_painting op
                                                    where op.painting_id = p.id) 'sold'
                            FROM painting p
                                     JOIN style s ON p.style_id = s.id
                                     JOIN technique t on p.technique_id = t.id
                                     join underground u on p.underground_id = u.id
                                     LEFT JOIN collection c ON p.collection_id = c.id
                                     LEFT JOIN series se ON p.series_id = se.id
                            WHERE p.id = ?;`;
module.exports.SelectStyles = `select * from style;`;
module.exports.SelectTechniques = `select * from technique;`;
module.exports.SelectUndergrounds = `select * from underground;`;
module.exports.SelectCollections = `select * from collection;`;
module.exports.UpdatePainting = `update painting set name = ?, style_id = ?, height = ?, width = ?, technique_id = ?, underground_id = ?, price = ?, description = ?, collection_id = ?
where id = ?;`;
module.exports.InsertPainting = `insert into painting (name, style_id, height, width, technique_id, underground_id, price, description, year, series_id, collection_id) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, null, ?);`

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
module.exports.SelectEmailFromBasketId = `select c.email from basket b 
join customer c on b.customer_id = c.id
where b.id = ?;`;

// OrderService
module.exports.SelectBasketIdFromStripeSessionId = `select b.id from basket b where b.stripe_session_id = ?;`
module.exports.SelectDataForOrder = `select b.customer_id, b.address_id from basket b where b.stripe_session_id = ?;`;
module.exports.SelectOrderItemsFromStripeSessionId = `select bp.painting_id from basket_painting bp
                                join basket b on bp.basket_id = b.id
                                where b.stripe_session_id = ?;`;
module.exports.InsertOrder = `insert into \`order\` (customer_id, orderDateTime, orderAddress_id, billingAddress_id, orderState_id, employee_id, changeDateTime, stripe_session_id)
                                VALUES (?, ?, ?, ?, 1, null, null, ?);`;
module.exports.InsertOrderItem = `insert into order_painting (order_id, painting_id) VALUES (?, ?);`;
module.exports.SelectSessionIdExistsInBasket = `select count(*) 'sessionIdExists' from basket b where b.stripe_session_id = ?;`;

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
module.exports.InsertAddress = `insert into address (addressType_id, title_id, firstName, lastName, street, postalCode, city, country_id, company)
                                values(?, ?, ?, ?, ?, ?, ?, ?, ?);`;
module.exports.UpdateAddress = `update address set addressType_id = ?, title_id = ?, firstName = ?, lastName = ?, street = ?, postalCode = ?, city = ?, country_id = ?, company = ?
                                where id = ?;`;
module.exports.InsertCustomerFromAddress = `insert into customer (email, password, phone, language_id) VALUES (?, null, ?, 1);`;
module.exports.UpdateCustomerFromAddress = `update customer set email = ?, phone = ? where id = ?;`;
module.exports.SelectAddressIdForBasketId = `select b.address_id from basket b where b.id = ?;`
module.exports.SelectCustomerIdForBasketId = `select b.customer_id from basket b where b.id = ?;`;
module.exports.UpdateLinkAddressToBasket = `update basket set address_id = ? where id = ?;`;
module.exports.UpdateLinkCustomerToBasket = `update basket set customer_id = ? where id = ?;`;
module.exports.SelectTitles = `SELECT t.id, t.description FROM title t;`;
module.exports.SelectCountries = `SELECT c.id, c.name FROM country c;`;

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
       c.email, t.description 'title', a.firstName, a.lastName, a.street, a.postalCode, a.city, c2.name 'country', a.company
from \`order\` o
join customer c on o.customer_id = c.id
join address a on o.orderAddress_id = a.id
join title t on a.title_id = t.id
join country c2 on a.country_id = c2.id
where o.stripe_session_id = ?`;
module.exports.SelectEmployees = `select e.email from employee e;`;
module.exports.SelectEmployeeWithUsername = 'select * from employee e where e.username = ?;'
module.exports.UpdateTokenForId = `update employee set token = ? where id = ?;`;
module.exports.SelectIsTokenValid = `select count(*) 'isValid' from employee e where e.token = ?;`;

// EmployeeService
module.exports.SelectEmployeeOrders = `select o.id,
       o.orderDateTime,
       (select count(*) from order_painting op
        where op.order_id = o.id) 'orderItemsCount',
       (select sum(p.price) from order_painting op
        join painting p on op.painting_id = p.id
        where op.order_id = o.id) 'orderValue',
        o2.id 'orderStateId',
       o2.description 'orderState',
       t.description 'title',
       a.firstName,
       a.lastName,
       a.street,
       a.postalCode,
       a.city,
       c.name 'country',
       a.company,
       c2.email,
       c2.phone
from \`order\` o
join address a on o.orderAddress_id = a.id
join title t on a.title_id = t.id
join country c on a.country_id = c.id
join orderState o2 on o.orderState_id = o2.id
join customer c2 on o.customer_id = c2.id;`;
module.exports.SelectEmployeeOrder = `select o.id,
       o.orderDateTime,
       (select count(*) from order_painting op
        where op.order_id = o.id) 'orderItemsCount',
       (select sum(p.price) from order_painting op
        join painting p on op.painting_id = p.id
        where op.order_id = o.id) 'orderValue',
        o2.id 'orderStateId',
       o2.description 'orderState',
       t.description 'title',
       a.firstName,
       a.lastName,
       a.street,
       a.postalCode,
       a.city,
       c.name 'country',
       a.company,
       c2.email,
       c2.phone
from \`order\` o
join address a on o.orderAddress_id = a.id
join title t on a.title_id = t.id
join country c on a.country_id = c.id
join orderState o2 on o.orderState_id = o2.id
join customer c2 on o.customer_id = c2.id
where o.id = ?;`;
module.exports.SelectEmployeeOrderItems = `select p.id, p.name, p.price from order_painting op
join painting p on op.painting_id = p.id
where op.order_id = ?;`;
module.exports.UpdateMarkOrderAsSent = `update \`order\` set orderState_id = 2 where id = ?;`;

// ImageService
module.exports.DeleteImageToPaintingLink = `delete from painting_image where image_id = ?;`;
module.exports.DeleteImage = `delete from image where id = ?;`;
module.exports.SelectLastImageId = `select id from image ORDER BY id DESC LIMIT 0, 1;`;
module.exports.InsertImage = `insert into image (path) values(?);`;
module.exports.InsertPaintingImage = `insert into painting_image (painting_id, image_id) values(?, ?);`;
