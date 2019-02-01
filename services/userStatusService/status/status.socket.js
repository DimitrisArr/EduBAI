

var WebSocket = require('ws');
var config = require('../config/config');
var playersStatus = require('./status.players.js');
var statuses = require('./status.def');
var logger = require('../logger/logger');

/******************************************************************/


const MESSAGE_TYPES = {
    USERS: "users",
    INVITE: "invite",
    ACCEPT: "accept",
    DECLINE: "decline"
};

class StatusSocket {

    /***********************************/

    constructor() {

        /*****************/

        this.server = new WebSocket.Server({ port: config.wsPort });
        this.connection = [];

        /*****************/

        this.server.on('listening', () => {
            logger.log('websocket for status is listening on port: ' + config.wsPort);
        });

        this.server.on('connection', (ws) => {

            /*****************/

            this.connection.push({
                user: ws.protocol,
                ws: ws
            });

            playersStatus.setStatus(ws.protocol, statuses.ONLINE);

            /*****************/

            ws.on('message', (data) => {

            });

            /*****************/

            ws.on('close', (code, reason) => {

                this.connection.splice(this.connection.findIndex(c => c.ws == ws), 1);

                playersStatus.setStatus(ws.protocol, statuses.OFFLINE);

            });

            /*****************/

        });

        /*****************/

    }

    /***********************************/

    broadcastUsers(message) {
        this.connection.forEach(c => {
            var toSend = {
                type: MESSAGE_TYPES.USERS,
                message: message
            }
            c.ws.send(JSON.stringify(toSend));
        });
    }

    /***********************************/

    sendPlayStatusUser(from, to, status) {
        var con2Send = this.connection.find(c => c.user == to);

        if (!con2Send)
            return false;

        var toSend = {
            type: status,
            user: from
        };

        con2Send.ws.send(JSON.stringify(toSend));
        return true;
    }

    /***********************************/

    sendInvitation(from, to) {
        return this.sendPlayStatusUser(from, to, MESSAGE_TYPES.INVITE);
    }

    /***********************************/

    sendDecline(from, to) {
        return this.sendPlayStatusUser(from, to, MESSAGE_TYPES.DECLINE);
    }

    /***********************************/

    sendAccept(from, to) {
        return this.sendPlayStatusUser(from, to, MESSAGE_TYPES.ACCEPT);
    }

    /***********************************/

}

/******************************************************************/

module.exports = new StatusSocket();

/******************************************************************/