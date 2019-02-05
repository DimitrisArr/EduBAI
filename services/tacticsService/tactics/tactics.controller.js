
var tacticsDb = require('./tactics.db');
var tacticStorage = require('./tactics.store');
var logger = require('../logger/logger');


/******************************************************************/



module.exports.newDefenciveTactic = async (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var data = req.file;

    if (!name || !username || !data) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var type = 'defence';


    var path = tacticStorage.saveTactic(name, type, username, data.buffer);

    if (!path) {
        res.status(500).send('error while saving tactic');
        return;
    }

    var ok = tacticsDb.addTactic(username, name, path, type);

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
    var data = req.file;

    if (!name || !username || !data) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var type = 'attack';


    var path = tacticStorage.saveTactic(name, type, username, data.buffer);

    if (!path) {
        res.status(500).send('error while saving tactic');
        return;
    }

    var ok = tacticsDb.addTactic(username, name, path, type);

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

module.exports.getAttackTactics = async (req, res) => {

    var username = req.query.username;

    if (!username) {
        res.status(400).send("parameter is missing");
        return;
    }

    logger.log("get attack tactics for user:", username);

    var tactics = await tacticsDb.getTactics(username);
    tactics = tactics.filter(t => t.type == 'attack');
    res.send(tactics);

};

/******************************************************************/

module.exports.getDefenceTactics = async (req, res) => {

    var username = req.query.username;

    if (!username) {
        res.status(400).send("parameter is missing");
        return;
    }

    logger.log("get defence tactics for user:", username);

    var tactics = await tacticsDb.getTactics(username);
    tactics = tactics.filter(t => t.type == 'defence');
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

module.exports.getTacticData = async (req, res) => {
    var username = req.query.username;
    var tactic = req.query.tactic;
    var type = req.query.type;

    if (!username || !tactic || !type) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    var tactics = await tacticsDb.getTactics(username);

    var tactic = tactics.find(t => t.type == type && t.name == tactic);

    if (!tactic) {
        res.status(404).send('tactic not found');
        return;
    }

    try {
        var data = tacticStorage.getTactic(path);
    } catch (e) {
        res.status(500).send('cant open tactic file');
        return;
    }

    res.send('data');

}

/******************************************************************/