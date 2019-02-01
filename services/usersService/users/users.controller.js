/******************************************************************/

var userDB = require('./users.db');
var logger = require('../logger/logger');

/******************************************************************/

module.exports.newUser = async (req, res) => {

    logger.log(`POST request - newUser - username: ${req.body.username}`);

    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    if (!username || !password || !email) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var user = {
        username: username,
        password: password,
        email: email
    };

    var isIn = await userDB.isInDB(username);
    if (isIn) {
        res.status(400).send('user already registered');
        return;
    }

    var status = await userDB.createUser(user);

    logger.log(`POST request - newUSer - registering user ${username} - status: ${status}`);

    if (status)
        res.send('user added successfully');
    else
        res.status(500).send('error while adding user');


}

/******************************************************************/
/**
 * @param {Request} req
 */
module.exports.validateUser = async (req, res) => {

    logger.log(`GET request - validateUser - username: ${req.query.username}`);

    var username = req.query.username;

    if (!username) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var isIn = await userDB.isInDB(username);

    logger.log(`GET request - validateUser - ${req.body.username} - response if in : ${isIn}`);

    if (!isIn) {
        res.status(404).send('user not registered');
        return;
    }

    res.send('user is registered');

}

/******************************************************************/

module.exports.getUsers = async (req, res) => {

    logger.log(`GET request - getUsers`);

    var users = await userDB.getUsers();

    if (!users) {
        users = [];
    }

    logger.log(`GET request - response - ${users}`);

    res.send(JSON.stringify(users));

}

/******************************************************************/

/**
 * @param {Request} req
 */
module.exports.logIn = async (req, res) => {


    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        res.status(400).send('parameter(s) missing');
        return;
    }


    var isOk = await userDB.validateCreds(username, password);

    if (isOk)
        res.send('ok');
    else
        res.status(401).send('wrong credentials');

}

/******************************************************************/
