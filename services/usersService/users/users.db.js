
/******************************************************************/

const mongoose = require('mongoose');
var config = require('../config/config');
var model = require('./users.models');

/******************************************************************/

class UsersDB {

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
     * @param {Object} user
     * @param {String} user.username 
     * @param {String} user.password 
     * @param {String} user.email 
     * @returns {Promise<boolean>}
     */
    async createUser(user) {

        if (!user.username || !user.password || !user.email)
            return false;

        const newUser = new this.User(user);

        try {
            var d = await newUser.save();
            return true;
        } catch (e) {
            return false;
        }

    }

    /***********************************/

    async getUsers() {

        var users = await this.User.find();

        users = users.map(u => {
            return {
                username: u.username
            };
        });

        return users;

    }

    /***********************************/

    async validateCreds(username, password) {

        if (!username || !password)
            return false;

        var user = await this.User.findOne({ username: username });

        return user.username == username && user.password == password;

    }

}


/******************************************************************/

module.exports = new UsersDB();

/******************************************************************/
