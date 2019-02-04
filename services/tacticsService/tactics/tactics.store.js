var config = require('../config/config');
var logger = require('../logger/logger');
var fs = require('fs');

/******************************************************************/

module.exports.saveTactic = (name, type, username, data) => {

    var path = type == 'attack' ? config.attackTacticsPath : config.defenciveTacticsPath;

    var finalPath = path + '/' + username + "_" + name + '.lp';
    try {
        fs.writeFileSync(finalPath, data, { encoding: 'utf8' });
        return finalPath;
    } catch (e) {
        return null;
    }

}

/******************************************************************/

module.exports.deleteTactic = (name, type, username) => {

    var path = type == 'attack' ? config.attackTacticsPath : config.defenciveTacticsPath;

    try {
        fs.unlinkSync(path + '/' + username + "_" + name);
        return true;
    } catch (e) {
        return false;
    }

}

/******************************************************************/

module.exports.getTactic = (path) => {
    return fs.readFileSync(path, { encoding: "utf8" });
};

/******************************************************************/