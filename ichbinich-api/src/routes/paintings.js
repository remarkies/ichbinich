const express = require('express');
const paintingService = require('../services/PaintingService');
const employeeService = require('../services/EmployeeService');
const responseController = require('../controllers/ResponseController');
const router = express.Router();

router.post('/',async function(request,response, next){
    const ids = request.body.ids;

    const params = ids !== undefined && ids.length > 0 ? ids : null;

    try {
        // get all paintings depending on params
        const paintings = await paintingService.getPaintings(params);

        return responseController.ok(response, paintings);
    } catch (error) {
        return responseController.fail(response, error);
    }
});

router.post('/painting',async function(request,response, next){
    const id = request.body.id;

    try {
        // get specific painting
        const painting = await paintingService.getPainting(id);

        return responseController.ok(response, painting);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.get('/styles',async function(request,response){

    try {
        // get all available styles of paintings
        const styles = await paintingService.getStyles();

        return responseController.ok(response, styles);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.get('/techniques',async function(request,response){
    try {
        // get all available techniques of paintings
        const techniques = await paintingService.getTechniques();

        return responseController.ok(response, techniques);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.get('/undergrounds',async function(request,response){
    try {
        // get all available undergrounds of paintings
        const undergrounds = await paintingService.getUndergrounds();

        return responseController.ok(response, undergrounds);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.get('/collections',async function(request,response){
    try {
        // get all available collections of paintings
        const collections = await paintingService.getCollections();

        return responseController.ok(response, collections);
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.post('/update',async function(request,response){
    try {
        const token = request.body.token;
        const painting = request.body.painting;

        const valid = await employeeService.isTokenValid(token);

        if (valid) {
            await paintingService.updatePainting(painting);
            return responseController.ok(response, {});
        } else {
            return responseController.fail(response, { message: 'Invalid token.' });
        }
    } catch(error) {
        return responseController.fail(response, error);
    }
});

router.post('/add',async function(request,response){
    try {
        const token = request.body.token;
        const painting = request.body.painting;

        const valid = await employeeService.isTokenValid(token);

        if (valid) {
            await paintingService.insertPainting(painting);
            return responseController.ok(response, {});
        } else {
            return responseController.fail(response, { message: 'Invalid token.' });
        }
    } catch(error) {
        return responseController.fail(response, error);
    }
});


module.exports = router;
