const DatabaseService = require('./DatabaseService');
const QueryService = require('./QueryService');

module.exports.login = async function(username) {
    let employees = await DatabaseService.query(QueryService.SelectEmployeeWithUsername, [username]);

    if (employees.length === 0) {
        return null;
    } else {
        return employees[0];
    }
}

module.exports.saveTokenForId = async function(token, id) {
    return await DatabaseService.query(QueryService.UpdateTokenForId, [token, id]);
}

module.exports.isTokenValid = async function(token) {
    return await DatabaseService.query(QueryService.SelectIsTokenValid, [token]);
}
