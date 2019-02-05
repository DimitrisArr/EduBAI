var logger = require('../logger/logger');
var players = require('./status.players');
var statuses = require('./status.def');
var invitationSystem = require('./invitations');

/******************************************************************/

module.exports.getOnlineUsers = (req, res) => {

    var onlineUsers = players.getPlayers.filter(p => p.status && p.status != statuses.OFFLINE);
    res.send(JSON.stringify(onlineUsers));

};

/******************************************************************/

module.exports.getOpponent = (req, res) => {

    var username = req.query.username;

    if (!username) {
        res.status(400).send('parameter username is missing');
        return;
    }

    var pair = players.getPairs().find(p => p.username1 == username || p.username2 == username);

    if (!pair) {
        res.status(404).send('opponent not found');
        return;
    }

    if (pair.username1 == username)
        res.send(pair.username2);
    else
        res.send(pair.username1);

}

/******************************************************************/

module.exports.inviteOpponent = (req, res) => {
    var from = req.body.from;
    var to = req.body.to;

    if (!from || !to) {
        res.status(400).send('parameter(s) missiing');
        return;
    }

    var isOk = invitationSystem.invitePlayer(from, to);

    if (!isOk)
        res.status(405).send('cant invite player');
    else
        res.send('ok');

}

/******************************************************************/

module.exports.acceptInvitation = (req, res) => {
    var from = req.body.from;
    var to = req.body.to;

    if (!from || !to) {
        res.status(400).send('parameter(s) missiing');
        return;
    }

    var isOk = invitationSystem.acceptInvitation(from, to);

    if (!isOk)
        res.status(405).send('cant accept invitation');
    else
        res.send('ok');

}

/******************************************************************/

module.exports.declineInvitation = (req, res) => {
    var from = req.body.from;
    var to = req.body.to;

    if (!from || !to) {
        res.status(400).send('parameter(s) missiing');
        return;
    }

    var isOk = invitationSystem.declineInvitation(from, to);

    if (!isOk)
        res.status(405).send('cant decline invitation');
    else
        res.send('ok');
}

/******************************************************************/

module.exports.cancelInvitation = (req, res) => {
    var from = req.body.from;
    var to = req.body.to;

    if (!from || !to) {
        res.status(400).send('parameter(s) missiing');
        return;
    }

    var isOk = invitationSystem.cancelInvitation(from, to);

    if (!isOk)
        res.status(405).send('cant cancel invitation');
    else
        res.send('ok');
}
