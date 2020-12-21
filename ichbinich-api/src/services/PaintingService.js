const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');

module.exports.getPaintings = async function(ids) {
    let paintings = [];

    if (ids === null) {

        // load all paintings
        paintings = await DatabaseService.query(QueryService.SelectLoadPaintings, null)

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
    let painting = await DatabaseService.query(QueryService.SelectLoadPainting, [id]);
    return painting[0];
};

module.exports.getImagesForPainting = async function(painting)  {
    return await DatabaseService.query(QueryService.SelectLoadPathsForPainting, [painting.id]);
};

module.exports.loadPaintings = function(ids)  {
    return new Promise((resolve, reject) => {


        let queryData = {
            query: ids === null? QueryService.SelectLoadPaintings : QueryService.SelectLoadPaintingsWithParams,
            params: ids === null? null : ids.join()
        };
        DatabaseService.query(queryData.query, queryData.params)
            .then((output) => {

                console.log('images returned', output.length);
                // create promises for getting all public foreach painting
                // includes public in json object of paintings
                let promises = this.getPaths(output);

                Promise.all(promises).then(() => {
                    resolve(output);
                });
            })
            .catch(err => {
                reject(new ErrorService.Error('Load paintings failed.', err));
            });
    });
};
module.exports.getPaths = function(paintings)  {

    // hold promises to return
    let promises = [];

    paintings.forEach((painting) => {
        promises.push(new Promise((resolve, reject) => {
            DatabaseService.query(QueryService.SelectLoadPathsForPainting, [painting.id])
                .then((paths) => {

                    // add found paths for painting to painting object
                    paintings.find(x => x.id === painting.id).paths = paths;
                    resolve();
            }).catch((err) => {
                reject(new ErrorService.Error('Load paths for painting ' + painting.id + ' failed.', err));
            });
        }));
    });

    return promises;
};
