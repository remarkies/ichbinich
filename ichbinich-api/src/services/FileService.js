const fs = require('fs');

module.exports.saveImageFile = async function(fileName, fileContent)  {
    fs.writeFile('/public/images/' + fileName, fileContent, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
};
