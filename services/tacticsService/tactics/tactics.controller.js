
var tacticsDb = require('./tactics.db');
var tacticStorage = require('./tactics.store');
var logger = require('../logger/logger');
var request = require('request-promise-native');

/******************************************************************/



module.exports.newDefenciveTactic = async (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var data = req.file;

    if (!name || !username || !data) {
        console.log(data, "dsfsd ");
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
        console.log(data, "dsfsd ");
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
        var data = tacticStorage.getTactic(tactic.path);
    } catch (e) {
        res.status(500).send('cant open tactic file');
        return;
    }

    try {
        //request.get(`http://hilite.me/api?code=${data}`
        var response = await request.post('http://hilite.me/api').form({ code: data, lexer: "prolog" });
    } catch (e) {
        console.log(e);
        res.status(500).send('error');
        return;
    }

    res.send(response);
}

/******************************************************************/

var preTacticPath = "C:/tactics/";

var preDefTactics = {
    "One player under the basket and the others on the ball holder": preTacticPath + "tactic_defensive_1.lp",
    "Each player on one opponent": preTacticPath + "tactic_defensive_2.lp",
    "Players stay around the basket (two point shoots)": preTacticPath + "tactic_defensive_3.lp"
};

var preAtcTactics = {
    "Ball holder goes under the basket and shoots": preTacticPath + "go_right_and_shoot_.lp",
    "Choose what to do based on probabilities": preTacticPath + "pithanothtes_tactic_right.lp",
    "All players go to baseline": preTacticPath + "all_go_right.lp"
};



module.exports.getPredefinedTactic = async (req, res) => {

    var tactic = req.query.tactic;
    var type = req.query.type;

    if (!tactic || !type) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    if (type = "attack") {
        if (Object.keys(preAtcTactics).includes(tactic)) {
            tactic = preAtcTactics[tactic];
        } else {
            tactic = false;
        }
    } else {
        if (Object.keys(preDefTactics).includes(tactic)) {
            tactic = preDefTactics[tactic];
        } else {
            tactic = false;
        }
    }

    if (!tactic) {
        res.status(404).send('tactic not found');
        return;
    }

    try {
        var data = tacticStorage.getTactic(tactic);
    } catch (e) {
        res.status(500).send('cant open tactic file');
        return;
    }

    try {
        //request.get(`http://hilite.me/api?code=${data}`
        var response = await request.post('http://hilite.me/api').form({ code: data, lexer: "prolog" });
    } catch (e) {
        console.log(e);
        res.status(500).send('error');
        return;
    }

    res.send(response);

}
