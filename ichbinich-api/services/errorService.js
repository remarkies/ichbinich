module.exports.newError = function(message, error)  {
    console.log('API ERROR:');
    console.log('Frontend message:', message);
    console.log('Backend message:');
    console.log(error);
};