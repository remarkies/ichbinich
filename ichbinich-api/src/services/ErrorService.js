module.exports.newError = function(message, error)  {
    console.log('API ERROR:');
    console.log('Frontend message:', message);
    console.log('Backend message:');
    console.log(error);
};

module.exports.Error = class {
    constructor(message, error) {
        this.message = message;
        this.error = error;
    }
    log() {
        console.log('API ERROR:');
        console.log('FRONTEND MESSAGE:', this.message);
        console.log('BACKEND MESSAGE:');
        console.log(this.error);
    }
};