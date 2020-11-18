let express = require('express');
let database = require('../services/database');
let paintingService = require('../services/paintingService');
let errorService = require('../services/errorService');
let router = express.Router();

// return json object with all paintings
router.get('/',function(request,response){
    paintingService.requestPaintings()
        .then(paintings => {
            response.send(paintings);
        })
        .catch((err) => {
        const message = 'paintings.requestPaintings() failed.';
        errorService.newError(message, err);
        response.send(message)
    });
});

router.post('/:ids', function(request,response) {
    let ids = request.body.ids;

    if(ids === undefined || ids.length === 0) {
        response.send([]);
        return;
    }
    paintingService.requestPaintingsWithParams(ids)
        .then(paintings => {
            response.send(paintings);
        })
        .catch((err) => {
        const message = 'paintings.requestPaintingsWithParams failed.';
        errorService.newError(message, err);
        response.send(message)
    });
});

function getPathsForPaintings(paintings) {
    let promises = [];
    paintings.forEach((painting) => {
        promises.push(new Promise((resolve, reject) => {
            getPathsForId(painting.id).then((paths) => {
                paintings.find(x => x.id === painting.id).paths = paths;
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }));
    });
    return promises;
}



module.exports = router;