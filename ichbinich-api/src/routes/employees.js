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
    console.log(employee);
    if (employee === null) {
        return responseController.unauthorized(response, "No employee found with this username!");
    }
    console.log(password, employee.password);

    let equals = await HashService.compare(password, employee.password)

    if (equals) {
        employee.token = TokenService.generateToken();
        return responseController.ok(response, employee);
    } else {
        return responseController.unauthorized(response, "Password not matching!");
    }
});

module.exports = router;
