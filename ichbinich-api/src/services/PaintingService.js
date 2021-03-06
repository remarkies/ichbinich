const databaseService = require('./DatabaseService');
const queryService = require('./QueryService');
const errorService = require('./ErrorService');

module.exports.getPaintings = async function(ids) {
    let paintings = [];

    if (ids === null) {

        try {
            // load all paintings
            paintings = await databaseService.query(queryService.SelectGetPaintings, null);
        } catch(error) {
            throw new errorService.Error('Function: getPaintings. Get paintings without params. Database query failed.', error);
        }
        // add image paths to paintings
        for (let painting of paintings) {
            try {
                painting.paths = await this.getImagesForPainting(painting);
            } catch (error) {
                throw new errorService.Error('Function: getPaintings. Get images for painting ' + painting.id + ' without params failed.', error);
            }
        }

    } else {
        // load specific paintings
        for (const id of ids) {
            try {
                const painting = await this.getPainting(id);
                paintings.push(painting);
            } catch(error) {
                throw new errorService.Error('Function: getPaintings. Get images for painting ' + id + ' with params failed.', error);
            }
        }
    }

    return paintings;
};

module.exports.getPainting = async function(id) {
    let paintings;

    try {
        paintings = await databaseService.query(queryService.SelectGetPainting, [id]);
    } catch(error) {
        throw new errorService.Error('Function: getPainting. Get painting ' + id + '. Database query failed.', error);
    }

    // painting found?
    if (paintings.length > 0) {

        let painting = paintings[0];

        try {
            // get images for painting
            painting.paths = await this.getImagesForPainting(painting);
        } catch(error) {
            throw new errorService.Error('Function: getPainting. Get images for painting ' + id + ' failed.', error);
        }

        return painting;
    } else {
        return null;
    }
};

module.exports.getImagesForPainting = async function(painting)  {
    let images;

    try {
        images = await databaseService.query(queryService.SelectGetPathsForPainting, [painting.id]);
    } catch(error) {
        throw new errorService.Error('Function: getImagesForPainting. Database query failed.', error);
    }

    return images;
};

module.exports.getStyles = async function() {
    let styles;

    try {
        styles = await databaseService.query(queryService.SelectStyles, null);
    } catch(error) {
        throw new errorService.Error('Function: getStyles. Database query failed.', error);
    }

    return styles;
};

module.exports.getTechniques = async function() {
    let techniques;

    try {
        techniques = await databaseService.query(queryService.SelectTechniques, null);
    } catch(error) {
        throw new errorService.Error('Function: getTechniques. Database query failed.', error);
    }

    return techniques;
};

module.exports.getUndergrounds = async function() {
    let undergrounds;

    try {
        undergrounds = await databaseService.query(queryService.SelectUndergrounds, null);
    } catch(error) {
        throw new errorService.Error('Function: getUndergrounds. Database query failed.', error);
    }

    return undergrounds;
};

module.exports.getCollections = async function() {
    let collections;

    try {
        collections = await databaseService.query(queryService.SelectCollections, null);
    } catch(error) {
        throw new errorService.Error('Function: getCollections. Database query failed.', error);
    }

    return collections;
};

module.exports.updatePainting = async function(painting) {
  try {
      await databaseService.query(queryService.UpdatePainting, [
          painting.name,
          painting.style_id,
          painting.height,
          painting.width,
          painting.technique_id,
          painting.underground_id,
          painting.price,
          painting.description,
          painting.collection_id,
          painting.id
      ]);
  } catch(error) {
      throw new errorService.Error('Function: updatePainting.', error);
  }
};

module.exports.insertPainting = async function(painting) {
  try {
      const result = await databaseService.query(queryService.InsertPainting, [
          painting.name,
          painting.style_id,
          painting.height,
          painting.width,
          painting.technique_id,
          painting.underground_id,
          painting.price,
          painting.description,
          painting.year,
          painting.collection_id
      ]);

      return result.insertId;
  } catch (error) {
      throw new errorService.Error('Function: insertPainting.', error);
  }
};
