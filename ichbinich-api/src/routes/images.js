const express = require('express');
const imageService = require('../services/ImageService');
const employeeService = require('../services/EmployeeService');
const fileService = require('../services/FileService');
const responseController = require('../controllers/ResponseController');

let router = express.Router();
router.post('/delete', async (request,response) => {
    const token = request.body.token;
    const id = request.body.id;

    const valid = await employeeService.isTokenValid(token);
    if (valid) {
        await imageService.deleteImage(id);
        return responseController.ok(response, {});
    } else {
        return responseController.fail(response, 'Not authorized!');
    }
});

router.post('/upload', async (request,response) => {
    const token = request.body.token;
    const id = request.body.id;
    const file = request.body.file;
    const valid = await employeeService.isTokenValid(token);
    if (valid) {
        console.log(file);
        await fileService.saveImageFile('image_0004.jpg', file);
        console.log(request.body);
        return responseController.ok(response, { message: 'uploaded' });
    } else {
        return responseController.fail(response, 'Not authorized!');
    }
});

module.exports = router;
