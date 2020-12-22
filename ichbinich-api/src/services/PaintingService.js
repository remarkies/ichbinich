const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');

module.exports.getPaintings = async function(ids) {
    let paintings = [];

    if (ids === null) {

        // load all paintings
        paintings = await DatabaseService.query(QueryService.SelectGetPaintings, null)

    } else {

        // load specific paintings
        for (const id of ids) {
            let painting = await this.getPainting(id);
            paintings.push(painting);
        }
    }

    // add image paths to paintings
    for (let painting of paintings) {
        painting.paths = await this.getImagesForPainting(painting);
    }

    return paintings;
};

module.exports.getPainting = async function(id) {
    let painting = await DatabaseService.query(QueryService.SelectGetPainting, [id]);
    return painting[0];
};

module.exports.getImagesForPainting = async function(painting)  {
    return await DatabaseService.query(QueryService.SelectGetPathsForPainting, [painting.id]);
};
