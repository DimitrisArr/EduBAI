
var statuses = require('./status.def');
var userService = require('../users/user.service');
var logger = require('../logger/logger');

var statusSocket = require('./status.socket');
/******************************************************************/

//status
//online
//offline
//ingame

var players = [];
var pairs = [];
//load players

userService.getUsers().then((us) => {
    this.players = us;

    logger.log('---players---');
    logger.log(this.players);
    logger.log('---end players---');
});
class PlayersStatus {

    /***********************************/

    constructor() {
        this.players = [];
        this.pairs = [];
        //load players

        userService.getUsers().then((us) => {
            this.players = us;

            logger.log('---players---');
            logger.log(this.players);
            logger.log('---end players---');
        });

    }

    /***********************************/

    async setStatus(username, status) {

        try {
            var users = await userService.getUsers();

            users.forEach(user => {
                if (!this.players.find(p => p.username == user.username))
                    this.players.push(user);
            });

        } catch (e) {
            //couldn't load users
            logger.log(`cant load users from user service`);
        }

        var player = this.players.find(p => p.username == username);

        if (player) {
            player.status = status;
            logger.log(`Update status to: ${status} for player: ${username}`);
        }




        //broadcast status ?!? (all players or only the one changed)
        statusSocket.sendMessage(JSON.stringify(users.filter(u => u.status != statuses.OFFLINE)));
    }

    /***********************************/

    getStatus(username) {

        var player = this.players.find(p => p.username == username);

        if (player)
            return player.status;
        return undefined;

    }

    /***********************************/

    getPlayers() {
        return this.players;
    }

    /***********************************/

    setPair(username1, username2) {

        var fPair = this.pairs.find(p => p.username1 == username1 || p.username1 == username2 || p.username2 == username1 || p.username2 == username2);

        if (fPair) {

            fPair.username1 = username1;
            fPair.username2 = username2;

        } else {

            this.pairs.push({
                username1: username1,
                username2: username2
            });

        }

        this.setStatus(username1, statuses.INGAME);
        this.setStatus(username2, statuses.INGAME);

    }

    /***********************************/

    getPairs() {
        return this.pairs;
    }

    /***********************************/

    arePairs(username1, username2) {
        return !!this.pairs.find(p => p.username1 == username1 || p.username1 == username2 || p.username2 == username1 || p.username2 == username2);
    }

    /***********************************/

}

/******************************************************************/
var pl = new PlayersStatus();
module.exports = pl;

/******************************************************************/