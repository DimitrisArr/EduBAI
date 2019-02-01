
var request = require('request-promise-native');
var config = require('../config/config');

class PlayerStatus {


    constructor() {
        this.prefix = `http://localhost:${config.playerStatusPort}`;
    }

    async getOpponent(user) {

        var options = {
            method: 'GET',
            uri: `${this.prefix}/getOpponent?username=${user}`,
            json: true
        };

        var response = await request(options);

        return response;
    }

}

module.exports = new PlayerStatus();