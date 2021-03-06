const bcrypt = require('bcryptjs');

module.exports.hash = async function (password) {
    return bcrypt.hash(password, 10);
}

module.exports.compare = async function (password, hash) {
    return bcrypt.compare(password, hash);
}
