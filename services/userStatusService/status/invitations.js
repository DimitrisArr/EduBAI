var statuses = require('./status.def');
var playerStatus = require('./status.players');
var statusSocket = require('./status.socket');
var logger = require('../logger/logger');

class InvitationSystem {

    constructor() {
        this.onInvite = [];
    }


    invitePlayer(from, to) {
        logger.log(`Sending invitation from ${from} to ${to}`);

        if (playerStatus.getStatus(from) != statuses.ONLINE || playerStatus.getStatus(to) != statuses.ONLINE) {
            logger.log(`invitation from ${from} to ${to} cant be send because one of them is offline`);
            return false;
        }

        this.onInvite.push({
            from: from,
            to: to
        });


        statusSocket.sendInvitation(from, to);
        return true;

    }

    acceptInvitation(from, to) {
        logger.log(`Sending invitation acceptance from ${from} to ${to}`);

        var pIndex = this.onInvite.findIndex(p => p.to == from && p.from == to)
        if (pIndex == -1)
            return false;

        this.onInvite.splice(pIndex, 1);
        statusSocket.sendAccept(from, to);

        playerStatus.setPair(from, to);

        return true;

    }

    declineInvitation(from, to) {
        logger.log(`Sending invitation decline from ${from} to ${to}`);

        var pIndex = this.onInvite.findIndex(p => p.to == from && p.from == to)
        if (pIndex == -1)
            return false;

        this.onInvite.splice(pIndex, 1);
        statusSocket.sendDecline(from, to);
        return true;
    }

    cancelInvitation(from, to) {
        logger.log(`Sending invitation cancel from ${from} to ${to}`);

        var pIndex = this.onInvite.findIndex(p => p.to == to && p.from == from)
        if (pIndex == -1)
            return false;

        this.onInvite.splice(pIndex, 1);
        statusSocket.sendCancel(from, to);
        return true;
    }

}

module.exports = new InvitationSystem();