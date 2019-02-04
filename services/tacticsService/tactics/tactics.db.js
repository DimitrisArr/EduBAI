
/******************************************************************/

const mongoose = require('mongoose');
var config = require('../config/config');
var model = require('./tactics.models');

/******************************************************************/

class UserTacticsDB {

    /***********************************/

    constructor() {

        mongoose.connect(config.mongoDBHost, { useNewUrlParser: true });

        this.Tactics = mongoose.model('Tactics', model.Tactics);

    }

    /***********************************/

    async isInDB(username) {
        var tactic = await this.Tactics.findOne({ username: username });
        return !!tactic;
    }

    /***********************************/

    /**
     * 
     * @param {string} username
     * @param {string} tacticname
     * @param {string} path
     * @param {string} type
     * 
     * @returns {Promise<boolean>}
     */
    async addTactic(username, tacticName, path, type) {
        try {
            if (!username || !tacticName || !path || !type)
                return false;


            const newUser = new this.Tactics({ username: username, name: tacticName, path: path, type: type });

            try {
                var d = await newUser.save();
                return true;
            } catch (e) {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /***********************************/

    async getTactics(username) {

        var tactics = await this.Tactics.find({ username });

        return tactics.map(t => {
            return {
                name: t.name,
                type: t.type,
                path: t.path
            };
        });

    }

    /***********************************/

    async deleteTactic(name, type, username) {
        try {
            if (!name || !type || !username)
                return false;

            var tactic = await this.Tactics.findOne({ username: username, name: name, type: type });

            if (!tactic) {
                return false;
            }
            else {
                await this.Tactics.deleteOne({ username: username, name: name, type: type });
                return true;
            }
        } catch (e) {
            return false;
        }
    }

}


/******************************************************************/

module.exports = new UserTacticsDB();

/******************************************************************/
