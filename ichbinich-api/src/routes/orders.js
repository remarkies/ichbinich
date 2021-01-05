const express = require('express');
const employeeService = require('../services/EmployeeService');
const responseController = require('../controllers/ResponseController');
const router = express.Router();

router.post('/get',async function(request,response, next){
    const token = request.body.token;
    try {
        const valid = await employeeService.isTokenValid(token);
        if (valid) {
            const orders = await employeeService.getOrders();
            return responseController.ok(response, orders);
        } else {
            return responseController.fail(response, 'Not authorized!');
        }
    } catch(error) {
        return responseController.fail(response, error.message);
    }
});

router.post('/order',async function(request,response, next){
    const token = request.body.token;
    const id = request.body.id;

    try {
        const valid = await employeeService.isTokenValid(token);
        if (valid) {
            const order = await employeeService.getOrder(id);
            return responseController.ok(response, order);
        } else {
            return responseController.fail(response, 'Not authorized!');
        }
    } catch(error) {
        return responseController.fail(response, error.message);
    }
});

router.post('/markAsSent',async function(request,response, next){
    const token = request.body.token;
    const id = request.body.id;
    const email = request.body.email;

    try {
        const valid = await employeeService.isTokenValid(token);
        if (valid) {
            await employeeService.markOrderAsSent(id);
            await employeeService.sendCustomerOrderSentMail(email);
            return responseController.ok(response);
        } else {
            return responseController.fail(response, 'Not authorized!');
        }
    } catch(error) {
        return responseController.fail(response, error.message);
    }
});

module.exports = router;
