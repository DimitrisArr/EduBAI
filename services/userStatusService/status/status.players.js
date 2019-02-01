
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

userService.getUsers().then((us) => {
    players = us;

    logger.log('---players---');
    logger.log(players);
    logger.log('---end players---');
});


/******************************************************************/

module.exports.setStatus = async (username, status) => {
    try {
        var users = await userService.getUsers();

        users.forEach(user => {
            if (!players.find(p => p.username == user.username))
                players.push(user);
        });

    } catch (e) {
        //couldn't load users
        logger.log(`cant load users from user service`);
    }

    console.log("players: ", players, " | ", username);
    var player = players.find(p => p.username == username);

    if (player) {

        if (status == statuses.OFFLINE && player.status == statuses.INGAME)
            return;

        player.status = status;
        logger.log(`Update status to: ${status} for player: ${username}`);
    }



    console.log(players,"asdas");
    //broadcast status ?!? (all players or only the one changed)
    statusSocket.broadcastUsers(players.filter(u => u.status && u.status != statuses.OFFLINE));
}

/******************************************************************/

module.exports.getStatus = (username) => {

    var player = players.find(p => p.username == username);

    if (player)
        return player.status;
    return undefined;

}

/******************************************************************/

module.exports.getPlayers = () => {
    return players;
}

/******************************************************************/

module.exports.setPair = (username1, username2) => {

    var fPair = pairs.find(p => p.username1 == username1 || p.username1 == username2 || p.username2 == username1 || p.username2 == username2);

    if (fPair) {

        fPair.username1 = username1;
        fPair.username2 = username2;

    } else {

        pairs.push({
            username1: username1,
            username2: username2
        });

    }

    setStatus(username1, statuses.INGAME);
    setStatus(username2, statuses.INGAME);

}

/******************************************************************/

module.exports.getPairs = () => {
    return pairs;
}

/******************************************************************/

module.exports.arePairs = (username1, username2) => {
    return !!pairs.find(p => p.username1 == username1 || p.username1 == username2 || p.username2 == username1 || p.username2 == username2);
}

/******************************************************************/
