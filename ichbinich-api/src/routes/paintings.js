const express = require('express');
const PaintingService = require('../services/PaintingService');
let router = express.Router();

// return json object with all paintings
router.post('/',async function(request,response, next){
    const ids = request.body.ids;
    const params = ids !== undefined && ids.length > 0 ? ids : null;

    const paintings = await PaintingService.getPaintings(params);

    response.send(paintings);
});

module.exports = router;
