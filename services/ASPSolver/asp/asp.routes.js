
/******************************************************************/

var controller = require('./asp.controller');

/******************************************************************/

module.exports.setRoutes = (app) => {

    app.post('/run', controller.run);

}

/******************************************************************/