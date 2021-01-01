const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');

module.exports.deleteImage = async function(id)  {
    await DatabaseService.query(QueryService.DeleteImageToPaintingLink, [id]);
    await DatabaseService.query(QueryService.DeleteImage, [id]);
};
