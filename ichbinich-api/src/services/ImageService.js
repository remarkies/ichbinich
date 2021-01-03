const databaseService = require('./DatabaseService');
const queryService = require('./QueryService');
const errorService = require('./ErrorService');

module.exports.deleteImage = async function(id)  {
    await databaseService.query(queryService.DeleteImageToPaintingLink, [id]);
    await databaseService.query(queryService.DeleteImage, [id]);
};

module.exports.insertImage = async function(imageName, paintingId) {
    try {
        const results = await databaseService.query(queryService.InsertImage, [imageName]);

        await databaseService.query(queryService.InsertPaintingImage, [paintingId, results.insertId]);
    } catch (error) {
        throw new errorService.newError('Function: insertImage', error);
    }
}
