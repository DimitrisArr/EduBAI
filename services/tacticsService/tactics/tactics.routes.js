
/******************************************************************/

var controller = require('./tactics.controller');

/******************************************************************/

module.exports.setRoutes = (app) => {

    app.post('/newAttackTactic', controller.newAttackTactic);

}

/******************************************************************/