const crypto = require('crypto');

module.exports.generateToken = function() {
    return crypto.randomBytes(64).toString('hex');
}
