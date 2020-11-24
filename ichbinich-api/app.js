const express = require('express')
require('dotenv').config();
const app = express();
const port = process.env.PORT;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const database = require('./src/services/DatabaseService');
database.connect().then(function () {
    console.log('Connected to mariaDB');
});

const paintings = require('./src/routes/paintings');
app.use('/paintings', paintings);

const infos = require('./src/routes/infos');
app.use('/infos', infos);

const basket = require('./src/routes/basket');
app.use('/basket', basket);

const address = require('./src/routes/address');
app.use('/address', address);

const payment = require('./src/routes/payment');
app.use('/payment', payment);

const order = require('./src/routes/order');
app.use('/order', order);

app.use('/public', express.static('./public'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
    console.log(err);
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})