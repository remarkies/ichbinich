const express = require('express');
const EmployeeService = require('../services/EmployeeService');
const HashService = require('../services/HashService');
const TokenService = require('../services/TokenService');
const responseController = require('../controllers/ResponseController');
let router = express.Router();

router.post('/get',async function(request,response, next){
    const token = request.body.token;

    const valid = await EmployeeService.isTokenValid(token);
    if (valid) {
        const orders = await EmployeeService.getOrders();
        return responseController.ok(response, orders);
    } else {
        return responseController.fail(response, 'Not authorized!');
    }
});

router.post('/markAsSent',async function(request,response, next){
    const token = request.body.token;
    const id = request.body.id;
    const email = request.body.email;

    const valid = await EmployeeService.isTokenValid(token);
    if (valid) {
        await EmployeeService.markOrderAsSent(id);
        await EmployeeService.sendCustomerOrderSentMail(email);
        return responseController.ok(response);
    } else {
        return responseController.fail(response, 'Not authorized!');
    }
});

module.exports = router;
