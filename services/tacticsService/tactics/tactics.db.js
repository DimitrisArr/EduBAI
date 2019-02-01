
/******************************************************************/

const mongoose = require('mongoose');
var config = require('../config/config');
var model = require('./tactics.models');

/******************************************************************/

class UserTacticsDB {

    /***********************************/

    constructor() {

        mongoose.connect(config.mongoDBHost, { useNewUrlParser: true });

        this.User = mongoose.model('User', model.User);

    }

    /***********************************/

    async isInDB(username) {

        var user = await this.User.findOne({ username: username });
        return !!user;

    }

    /***********************************/

    /**
     * 
     * @param {string} username
     * @param {object} tactic
     * @param {string} tactic.name
     * @param {string} tactic.path
     * @param {string} tactic.type
     * 
     * @returns {Promise<boolean>}
     */
    async addTactic(username, tactic) {
        try {
            if (!username || !tactic)
                return false;

            var user = await this.User.findOne({ username: username });

            if (!user) {
                const newUser = new this.User({ username: username, tactic: [tactic] });

                try {
                    var d = await newUser.save();
                    return true;
                } catch (e) {
                    return false;
                }
            } else {
                user.tactics.push(tactic);
                await this.User.findOneAndUpdate({ username: username }, { tactics: user.tactics });
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    /***********************************/

    async getTactics(username) {

        var user = await this.User.findOne({ username });


        return user.tactics;

    }

    /***********************************/

    async deleteTactic(name, type, username) {
        try {
            if (!name || !type || !username)
                return false;

            var user = await this.User.findOne({ username: username });

            if (!user) {
                return false;
            }
            else {
                var index = user.tactics.findIndex(t => t.name == name && t.type == type);
                user.tactics.splice(index, 1);
                await this.User.findOneAndUpdate({ username: username }, { tactics: user.tactics });
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
