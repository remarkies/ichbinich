const express = require('express');
const PaintingService = require('../services/PaintingService');
let router = express.Router();

// return json object with all paintings
router.post('/',async function(request,response, next){
    const ids = request.body.ids;
    const params = ids !== undefined && ids.length > 0 ? ids : null;

    PaintingService.loadPaintings(params)
        .then(paintings => {
            response.send(paintings);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;