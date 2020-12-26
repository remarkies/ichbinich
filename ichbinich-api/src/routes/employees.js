const express = require('express');
const EmployeeService = require('../services/EmployeeService');
const HashService = require('../services/HashService');
const TokenService = require('../services/TokenService');
const responseController = require('../controllers/ResponseController');
let router = express.Router();

// return json object with all paintings
router.post('/authenticate',async function(request,response, next){
    const username = request.body.username;
    const password = request.body.password;

    let employee = await EmployeeService.login(username);

    if (employee === null) {
        return responseController.unauthorized(response, "No employee found with this username!");
    }

    let equals = await HashService.compare(password, employee.password)

    if (equals) {
        employee.token = TokenService.generateToken();
        EmployeeService.saveTokenForId(employee.token, employee.id);
        return responseController.ok(response, { token: employee.token });
    } else {
        return responseController.unauthorized(response, "Password not matching!");
    }
});
router.post('/isTokenValid',async function(request,response, next){
    const token = request.body.token;
    let result = await EmployeeService.isTokenValid(token);

    return responseController.ok(response, { valid: result });
});
module.exports = router;
