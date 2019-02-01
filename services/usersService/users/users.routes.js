
/******************************************************************/

var controller = require('./users.controller');

/******************************************************************/

module.exports.setRoutes = (app) => {

    app.post('/newUser', controller.newUser);

    app.get('/validateUser', controller.validateUser);
    app.get('/getUsers', controller.getUsers);

    app.post('/login', controller.logIn);

}

/******************************************************************/