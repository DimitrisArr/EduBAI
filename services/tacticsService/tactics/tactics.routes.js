
/******************************************************************/

var controller = require('./tactics.controller');

/******************************************************************/

module.exports.setRoutes = (app) => {

    app.post('/newAttackTactic', controller.newAttackTactic);
    app.post('/newDefenceTactic', controller.newAttackTactic);
    app.post('/deleteTactic', controller.deleteTactic);

    app.get('/getTactics', controller.getTactics);

}

/******************************************************************/