const bcrypt = require('bcrypt');

module.exports.hash = async function (password) {
    return await bcrypt.hash(password, 10);
}

module.exports.compare = async function (password, hash) {
    return bcrypt.compare(password, hash);
}
