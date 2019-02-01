
var request = require('request-promise-native');
var config = require('../config/config');

class PlayerStatus {


    constructor() {
        this.prefix = `http://localhost:${config.playerStatusPort}`;
    }

    async getOpponent() {
        
        var options = {
            method: 'GET',
            uri: `${this.prefix}/getOpponent`,
            json: true
        };

        var response = await request(options);

    }

}