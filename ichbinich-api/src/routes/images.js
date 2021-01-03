const express = require('express');
const imageService = require('../services/ImageService');
const employeeService = require('../services/EmployeeService');
const fileService = require('../services/FileService');
const responseController = require('../controllers/ResponseController');
const multer = require('multer');   //FOR FILE UPLOAD

const tmpFileFolder = './public/uploads';
const fileFolder = './public/images';

const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, tmpFileFolder); //image storage path
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        let newFileName = 'image_';

        cb(null, file.originalname);
    }
});

const upload = multer({ //multer settings
    storage: storage
}).single('file');

const router = express.Router();

router.post('/upload', upload, async (request, response) => {

    const token = request.body.token;
    const id = request.body.id;
    const fileName = request.body.fileName;

    const valid = await employeeService.isTokenValid(token);
    if (valid) {
        const tmpFileName = tmpFileFolder + '/' + fileName;

        if(fileService.fileExists(tmpFileName)) {

            const newImageName = await fileService.getNewImageName();

            await fileService.moveFile(tmpFileName, fileFolder + '/' + newImageName);

            await imageService.insertImage(newImageName, id);

            return responseController.ok(response, { message: 'uploaded' });
        } else {
            return responseController.fail(response, { message: 'upload failed' });
        }
    } else {
        return responseController.fail(response, 'Not authorized!');
    }
});

router.post('/delete', async (request, response) => {
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

module.exports = router;
