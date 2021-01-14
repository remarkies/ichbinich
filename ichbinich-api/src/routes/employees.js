const express = require('express');
const employeeService = require('../services/EmployeeService');
const hashService = require('../services/HashService');
const tokenService = require('../services/TokenService');
const responseController = require('../controllers/ResponseController');

const router = express.Router();

router.post('/authenticate',async function(request,response, next){
    const username = request.body.username;
    const password = request.body.password;

    let employee = await employeeService.login(username);

    if (employee === null) {
        return responseController.unauthorized(response, "No employee found with this username!");
    }

    let equals = await hashService.compare(password, employee.password)

    if (equals) {
        employee.token = tokenService.generateToken();
        await employeeService.saveTokenForId(employee.token, employee.id);
        return responseController.ok(response, { token: employee.token });
    } else {
        return responseController.unauthorized(response, "Password not matching!");
    }
});
router.post('/isTokenValid',async function(request,response, next){
    const token = request.body.token;
    let result = await employeeService.isTokenValid(token);

    return responseController.ok(response, { valid: result });
});

module.exports = router;
