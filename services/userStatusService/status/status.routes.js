
/******************************************************************/

var controller = require('./status.controller');

/******************************************************************/

module.exports.setRoutes = (app) => {

    app.get('/getOnlineUsers', controller.getOnlineUsers);
    app.get('/getOpponent', controller.getOpponent);

    app.post('/inviteOpponent', controller.inviteOpponent);
    app.post('/acceptInvitation', controller.acceptInvitation);
    app.post('/declineInvitation', controller.declineInvitation);
    app.post('/cancelInvitation', controller.cancelInvitation);

}

/******************************************************************/