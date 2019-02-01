
var request = require('request-promise-native');
var config = require('../config/config');

class Users {


    constructor() {
        this.prefix = `http://localhost:${config.usersServicePort}`;
    }

    async getUsers() {

        var options = {
            method: 'GET',
            uri: `${this.prefix}/getUsers`,
            json: true
        };

        var response = await request(options);

        return response;
    }

}


module.exports = new Users();