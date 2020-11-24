const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');
const ErrorService = require('./ErrorService');

module.exports.loadPaintings = function(ids)  {
    return new Promise((resolve, reject) => {

        let queryData = {
            query: ids === null? QueryService.SelectLoadPaintings : QueryService.SelectLoadPaintingsWithParams,
            params: ids === null? null : ids
        };

        DatabaseService.query(queryData.query, queryData.params)
            .then((output) => {

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