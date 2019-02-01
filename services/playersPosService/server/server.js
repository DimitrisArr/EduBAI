
/******************************************************************/

var WebSocket = require('ws');
var config = require('../config/config');

var playerStatus = require('../playerStatus/playerStatus');
/******************************************************************/

class PosServer {

    /***********************************/

    constructor() {

        /*****************/

        this.connections = [];

        this.server = new WebSocket.Server({ port: config.port });

        /*****************/

        this.server.on('connection', (ws) => {

            /*****************/

            playerStatus.getOpponent(ws.protocol).then((opp) => {
                this.connections.push({
                    player: ws.protocol,
                    ws: ws,
                    //TODO: Find out how to get this data
                    opponent: opp
                });
            }).catch((err) => {
                ws.close(1, `can't find registered opponent`);
            });


            /*****************/

            ws.on('message', (data) => {
                var sender = this.connections.find(c => c.ws == ws);

                if (!sender || !sender.opponent)
                    return;

                var opponent = this.connections.find(c => c.player == sender.opponent);

                opponent.ws.send(data);

            });

            /*****************/

            ws.on('close', (code, reason) => {
                var c2Close = this.connections.findIndex(c => c.ws == ws);
                this.connections.splice(c2Close, 1);
            });

            /*****************/

        });

        /*****************/

    }

    /***********************************/
}

/******************************************************************/

module.exports = new PosServer();

/******************************************************************/