const express = require('express')
require('dotenv').config();
const ichbinichApp = express();
const port = process.env.PORT;

const cors = require('cors');
ichbinichApp.use(cors());

const bodyParser = require('body-parser')
ichbinichApp.use(bodyParser.urlencoded({ extended: true }));
ichbinichApp.use(bodyParser.json());
ichbinichApp.use(bodyParser.raw());

const database = require('./src/services/DatabaseService');
database.connect().then(function () {
    console.log('Connected to mariaDB');
});

const paintings = require('./src/routes/paintings');
ichbinichApp.use('/paintings', paintings);

const basket = require('./src/routes/basket');
ichbinichApp.use('/basket', basket);

const address = require('./src/routes/address');
ichbinichApp.use('/address', address);

const payment = require('./src/routes/payment');
ichbinichApp.use('/payment', payment);

const order = require('./src/routes/order');
ichbinichApp.use('/order', order);

const employees = require('./src/routes/employees');
ichbinichApp.use('/employees', employees);

const orders = require('./src/routes/orders');
ichbinichApp.use('/orders', orders);

const images = require('./src/routes/images');
ichbinichApp.use('/images', images);

ichbinichApp.use('/public', express.static('./public'))

// catch 404 and forward to error handler
ichbinichApp.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
ichbinichApp.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
    console.log(err);
});

ichbinichApp.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
