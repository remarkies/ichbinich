const errorService = require('./ErrorService');
const databaseService = require('./DatabaseService');
const queryService = require('./QueryService');

const fs = require('fs');

module.exports.getNewImageName = async function() {
    try {
        const results = await databaseService.query(queryService.SelectLastImageId, null);
        let newImageName = (results[0].id + 1).toString();

        while(newImageName.length < 4) {
            newImageName = '0' + newImageName;
        }

        return 'image_' + newImageName + '.jpg';
    } catch(error) {
        throw new errorService.newError('Function: getNewImageName', error);
    }
};

module.exports.moveFile = async function(oldFile, newFile)  {
    try {
        await fs.rename(oldFile, newFile, () => {});
    } catch(error) {
        throw new errorService.newError('Function: moveFile', error);
    }
};

module.exports.fileExists = function(path) {
    try {
        return fs.existsSync(path);
    } catch(error) {
        throw new errorService.newError('Function: fileExists', error);
    }
};