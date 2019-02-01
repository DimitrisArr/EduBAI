
var tacticsDb = require('./tactics.db');
var tacticStorage = require('./tactics.store');
var logger = require('../logger/logger');
const multer = require('multer');

/******************************************************************/

// SET STORAGE
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports.newDefenciveTactic = async (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var data = req.body.data;

    if (!name || !username || !data) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var type = 'defence';


    var path = tacticStorage.saveTactic(name, type, username, data);

    if (!path) {
        res.status(500).send('error while saving tactic');
        return;
    }

    var ok = tacticsDb.addTactic(username, { name: name, path: path, type: type });

    if (!ok) {
        res.status(500).send('error while saving tactic');
        return;
    }

    res.send('ok');

};

/******************************************************************/

module.exports.newAttackTactic = async (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var data = req.body.data;

    if (!name || !username || !data) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var type = 'attack';


    var path = tacticStorage.saveTactic(name, type, username, data);

    if (!path) {
        res.status(500).send('error while saving tactic');
        return;
    }

    var ok = tacticsDb.addTactic(username, { name: name, path: path, type: type });

    if (!ok) {
        res.status(500).send('error while saving tactic');
        return;
    }

    res.send('ok');
};

/******************************************************************/

module.exports.getTactics = async (req, res) => {

    var username = req.query.username;

    if (!username) {
        res.status(400).send("parameter is missing");
        return;
    }

    logger.log("get tactics for user:", username);

    var tactics = await tacticsDb.getTactics(username);

    res.send(tactics);

};

/******************************************************************/

module.exports.deleteTactic = async (req, res) => {

    var username = req.body.username;
    var tactic = req.body.tactic;
    var type = req.body.type;

    if (!username || !tactic || !type) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var ok = await tacticsDb.deleteTactic(tactic, type, username);

    if (!ok) {
        res.status(500).send('cant delete tactic');
        return;
    }

    var ok = tacticStorage.deleteTactic(tactic, type, username);

    res.send('ok');

}

/******************************************************************/
