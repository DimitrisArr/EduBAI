
/* ***************************************************** */

var PlayersNames = {
    myplayer1: "aaa",
    myplayer2: "bbb",
    myplayer3: "ccc",

    oppplayer1: "ddd",
    oppplayer2: "eee",
    oppplayer3: "fff",
};

var TeamNames = {
    team1Name: localStorage.getItem('username'),
    team2Name: localStorage.getItem('opponent')
}

var server = new WebSocket("ws://localhost:8080/project-server/client?" + localStorage.getItem('username'));

playerPositioning.connect(localStorage.getItem('username'));

var attacking = localStorage.getItem('attacker') == 'true';

var areWeOntheLeft = localStorage.getItem('leftCourt') == 'true';

var scoreTEAM1 = -1;
var scoreTEAM2 = -1;

var round = -1;

var whoHasBall = "no one";

var currentTactic = "";
var isTacticCustom = false;


var textForDisplay = {
    player1: "",
    player2: "",
    player3: ""
};

var opponentInfoText = {
    player1: "",
    player2: "",
    player3: ""
};

var playerPositions = {
    p11X: 0,
    p11Y: 0,

    p12X: 0,
    p12Y: 0,

    p13X: 0,
    p13Y: 0,

    p21X: 0,
    p21Y: 0,

    p22X: 0,
    p22Y: 0,

    p23X: 0,
    p23Y: 0,
};

var start_game_btn;


var predefAttackTacticsDict = {
    tactic1: "Ball holder goes under the basket and shoots",
    tactic2: "Choose what to do based on probabilities",
    tactic3: "All players go to baseline",
    tactic4: "Each player goes to the baseline closest to them"
};

var predefDefendTacticsDict = {
    tactic1: "One player under the basket and the others on the ball holder",
    tactic2: "Each player on one opponent",
    tactic3: "Players stay around the basket (two point shoots)"
};

var myAttackTacticsDict = {
};

var myDefendTacticsDict = {
};





/*************************** DRAG n DROP ****************************************** */

var whoIsBeingDragged;


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var finalTargetID = ev.target.id;
    if (ev.target.id.includes("player")) { //we only want to add "DIV" if it's the players, not the ball
        if (!ev.target.id.includes("div")) {
            finalTargetID += "_div";
        }
    }

    ev.dataTransfer.setData("text", finalTargetID);
    whoIsBeingDragged = document.getElementById(finalTargetID);

    console.log("who is being dragged ? " + whoIsBeingDragged.id);
    console.log("ev.target.id ? " + ev.target.id);
    console.log("finalTargetID ? " + finalTargetID);


    console.log(ev.dataTransfer);
}

function resizePlayersAndBall(cell) {
    var numOfChildren = cell.childElementCount;

    if (numOfChildren == 1 || numOfChildren == 2) {
        Array.from(cell.children).forEach(child => {
            Array.from(child.children).forEach(childIMG => {
                if (childIMG.id.includes("player")) { // = not the ball, but the player img
                    childIMG.style.height = "80px";
                    childIMG.style.verticalAlign = "middle";
                }

                if (childIMG.id.includes("ball")) { // = the ball
                    childIMG.style.height = "35px";
                    childIMG.style.width = "35px";
                    childIMG.style.verticalAlign = "middle";
                    childIMG.style.marginLeft = "-38px";
                    childIMG.style.marginBottom = "-46px";
                }
            });
        });
    }

    if (numOfChildren == 3) {
        Array.from(cell.children).forEach(child => {
            Array.from(child.children).forEach(childIMG => {
                if (childIMG.id.includes("player")) { // = not the ball, but the player img
                    childIMG.style.height = "55px";
                    childIMG.style.verticalAlign = "-webkit-baseline-middle";
                }

                if (childIMG.id.includes("ball")) { // = the ball
                    childIMG.style.height = "20px";
                    childIMG.style.width = "20px";
                    childIMG.style.verticalAlign = "middle";
                    childIMG.style.marginLeft = "-26px";
                    childIMG.style.marginBottom = "-50px";
                }
            });
        });
    }

    if (numOfChildren == 4) {
        Array.from(cell.children).forEach(child => {
            Array.from(child.children).forEach(childIMG => {
                if (childIMG.id.includes("player")) { // = not the ball, but the player img
                    childIMG.style.height = "41px";
                    childIMG.style.verticalAlign = "-webkit-baseline-middle";
                }

                if (childIMG.id.includes("ball")) { // = the ball
                    childIMG.style.height = "15px";
                    childIMG.style.width = "15px";
                    childIMG.style.verticalAlign = "middle";
                    childIMG.style.marginLeft = "-18px";
                    childIMG.style.marginBottom = "-41px";
                }
            });
        });
    }

    if (numOfChildren == 5 || numOfChildren == 6) {
        Array.from(cell.children).forEach(child => {
            Array.from(child.children).forEach(childIMG => {
                if (childIMG.id.includes("player")) { // = not the ball, but the player img
                    childIMG.style.height = "34px";
                    childIMG.style.verticalAlign = "unset";
                }

                if (childIMG.id.includes("ball")) { // = the ball
                    childIMG.style.height = "10px";
                    childIMG.style.width = "10px";
                    childIMG.style.verticalAlign = "middle";
                    childIMG.style.marginLeft = "-14px";
                    childIMG.style.marginBottom = "-6px";
                }
            });

        });
    }
}


function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var idOfTarget = ev.target.id;
    console.log("target: ", ev.target.id);

    if (!whoIsBeingDragged) {
        return;
    }

    if (!data) {
        return;
    }

    if (!ev.target) {
        return;
    }

    //if we are moving the ball, we only want to attach it to a player
    if (whoIsBeingDragged.id.includes("ball")) {
        console.log("I am dragging the ball");
        if (!idOfTarget.includes("player")) {
            return;
        } else { //assignment of ball to a player DIV
            //target is possibly the IMG player ---> need to make it the div

            var correctTargetID = idOfTarget.includes("div") ? idOfTarget : idOfTarget + "_div";
            var correctTarget = document.getElementById(correctTargetID);

            console.log("correctTargetID : " + correctTargetID);
            console.log("whoIsBeingDragged : " + whoIsBeingDragged.id);

            if (!correctTarget) {
                return;
            }

            correctTarget.appendChild(whoIsBeingDragged);
            whoIsBeingDragged.style.width = "35px";
            whoIsBeingDragged.style.marginLeft = "-45px";
            whoIsBeingDragged.style.marginBottom = "-46px";

            whoHasBall = idOfTarget.replace("_div", ""); // player1_team1
            console.log("who has ball? --> " + idOfTarget);

            // if (whoHasBall.includes("team1")) {
            //     attacking = true;
            // } else {
            //     attacking = false;
            // }

            if (attacking) {
                start_game_btn = document.getElementById('go_btn_attack_tactic_selected');
            } else {
                start_game_btn = document.getElementById('go_btn_defend_tactic_selected');
            }

            updatePlayerPositions2sendThem();
        }
    }


    if (whoIsBeingDragged.id.includes("player")) {
        console.log("I am dragging a player");

        if (idOfTarget.includes("ball")) { //if we accidentally try to attach a player to the ball, it means we were trying to attach it to the parent parent cell
            document.getElementById(idOfTarget).parentNode.parentNode.appendChild(document.getElementById(data));
            console.log("1111111111111111111111");

        } else if (idOfTarget.includes("player")) { //if we try to attach a player to another player or player div, it means we were trying to attach it to the parent cell
            if (idOfTarget.includes("div")) {
                document.getElementById(idOfTarget).parentNode.appendChild(document.getElementById(data));
            } else {
                document.getElementById(idOfTarget).parentNode.parentNode.appendChild(document.getElementById(data));
            }
            console.log("2222222222222222222");

        } else { //all okay, i'm trying to attach a player to a cell

            if (!document.getElementById(data)) {
                return;
            }


            console.log(idOfTarget + " : " + document.getElementById(data).id);
            document.getElementById(idOfTarget).appendChild(document.getElementById(data));
            console.log("33333333333333333333333333333333333");

            updatePlayerPositions2sendThem();

        }
    }


    var court = document.getElementById("court_grid");
    Array.from(court.children).forEach(child => {
        resizePlayersAndBall(child);
    });

}

/*********************************************************************************************** */

function updateOpponentCourtPositionAndBall(position, ballHolder) {

    if (areWeOntheLeft) {

        let pid = null;
        let x = 0;
        let y = 0;

        if (playerPositions.p21X == 0 && position.p21X != 0)
            pid = '#player1_team2_div';
        if (playerPositions.p22X == 0 && position.p22X != 0)
            pid = '#player2_team2_div';
        if (playerPositions.p23X == 0 && position.p23X != 0)
            pid = '#player3_team2_div';


        if (pid) {
            if (x != 5 || y != 7)
                $(pid).appendTo($("#cell_57"));
            else
                $(pid).appendTo($("#cell_56"));
        }


        playerPositions.p21X = position.p21X;
        playerPositions.p21Y = position.p21Y;

        playerPositions.p22X = position.p22X;
        playerPositions.p22Y = position.p22Y;

        playerPositions.p23X = position.p23X;
        playerPositions.p23Y = position.p23Y;

    } else {

        let pid = null;
        let x = 0;
        let y = 0;

        if (playerPositions.p11X == 0 && position.p11X != 0)
            pid = '#player1_team1_div';
        if (playerPositions.p12X == 0 && position.p12X != 0)
            pid = '#player2_team1_div';
        if (playerPositions.p13X == 0 && position.p13X != 0)
            pid = '#player3_team1_div';


        if (pid) {
            if (x != 1 || y != 1)
                $(pid).appendTo($("#cell_11"));
            else
                $(pid).appendTo($("#cell_11"));
        }


        playerPositions.p11X = position.p11X;
        playerPositions.p11Y = position.p11Y;

        playerPositions.p12X = position.p12X;
        playerPositions.p12Y = position.p12Y;

        playerPositions.p13X = position.p13X;
        playerPositions.p13Y = position.p13Y;
    }

    if (!attacking && whoHasBall == "no one" && ballHolder != 'no one') {
        $('#' + ballHolder).parent().append($('#ball_img_id'));

        $('#ball_img_id').css("width", "35px");
        $('#ball_img_id').css('marginLeft', "-45px");
        $('#ball_img_id').css('marginBottom', "-46px");
        whoHasBall = ballHolder;
    }

    if (!attacking && whoHasBall != ballHolder) {
        whoHasBall = ballHolder;
    }

    console.log("hello", playerPositions);
    updatePlayerAndBallPositionsOnCourt();

}

/*********************************************************************************************** */

function updatePlayerPositions2sendThem() {
    var court = document.getElementById("court_grid");
    Array.from(court.children).forEach(cell => {
        if (cell.hasChildNodes()) { // ==> this cell has players
            Array.from(cell.children).forEach(player => {
                console.log("player in cell " + cell.id + " is " + player.id);
                var playerName = "p";
                if (player.id.includes("team1")) {
                    playerName += "1";
                    var cellNum = cell.id.replace("cell_", "");

                    var cellNumX = cellNum[0];
                    var cellNumY = cellNum[1];

                    if (cellNumY > 4) {
                        areWeOntheLeft = false;
                    }

                } else {
                    playerName += "2";

                    var cellNum = cell.id.replace("cell_", "");

                    var cellNumX = cellNum[0];
                    var cellNumY = cellNum[1];

                    if (cellNumY < 4) {
                        areWeOntheLeft = false;
                    }
                }

                if (player.id.includes("player1")) {
                    playerName += "1";
                } else if (player.id.includes("player2")) {
                    playerName += "2";
                } else {
                    playerName += "3";

                }

                var position = cell.id.replace("cell_", "");

                var playerPosX = position[0];
                var playerPosY = position[1];

                console.log(playerName + " is at " + playerPosX + playerPosY);

                playerPositions[playerName + "X"] = playerPosX;
                playerPositions[playerName + "Y"] = playerPosY;

            });
        }
    });

    console.log(playerPositions, whoHasBall, "asdas");
    //if a flag
    playerPositioning.sendData(playerPositions, whoHasBall);
}


/*********************************************************************************************** */
function getKeyByValue(object, value) {
    return (_.invert(object))[value.replace(/\s\s+/g, ' ').trim()];
}


function onStart() {

    updatePlayerPositions2sendThem();

    var theball = document.getElementById("ball_img_id");

    whoHasBall = theball.parentNode.id.replace("_div", "");
    console.log(whoHasBall);

    var playerWithBall = whoHasBall.replace("player", "").replace("_team", "")[0]; // 1

    console.log("player with ball: " + playerWithBall);

    var tactic_tmp = "";

    if (attacking) {
        if (isTacticCustom)
            tactic_tmp = getKeyByValue(myAttackTacticsDict, currentTactic);
        else
            tactic_tmp = getKeyByValue(predefAttackTacticsDict, currentTactic);
    } else {
        if (isTacticCustom)
            tactic_tmp = getKeyByValue(myDefendTacticsDict, currentTactic);
        else
            tactic_tmp = tactic_tmp = getKeyByValue(predefDefendTacticsDict, currentTactic);
    }

    console.log("AAAAAAAAAAAAAAAAAAAA currentTactic: " + currentTactic);

    console.log("AAAAAAAAAAAAAAAAAAAA tactic_tmp: " + tactic_tmp);

    var data = {
        type: 'START',
        tactic: tactic_tmp,
        attacker: attacking,
        leftCourt: areWeOntheLeft,
        myname: localStorage.getItem('username'),
        opponent: localStorage.getItem('opponent'),
        players: {
            p11X: playerPositions.p11X,
            p11Y: playerPositions.p11Y,

            p12X: playerPositions.p12X,
            p12Y: playerPositions.p12Y,

            p13X: playerPositions.p13X,
            p13Y: playerPositions.p13Y,

            p21X: playerPositions.p21X,
            p21Y: playerPositions.p21Y,

            p22X: playerPositions.p22X,
            p22Y: playerPositions.p22Y,

            p23X: playerPositions.p23X,
            p23Y: playerPositions.p23Y,

            playerWithBall: playerWithBall
        }
    };

    var jsonData = JSON.stringify(data);
    server.send(jsonData);

    console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAA : " + jsonData);

}

function onNewRound() {

    updatePlayerPositions2sendThem();
    var playerWithBall = whoHasBall.replace("player", "").replace("_team", "")[0]; // 1

    console.log("player with ball: " + playerWithBall);

    var tactic_tmp = "";

    if (attacking) {
        if (isTacticCustom)
            tactic_tmp = getKeyByValue(myAttackTacticsDict, currentTactic);
        else
            tactic_tmp = getKeyByValue(predefAttackTacticsDict, currentTactic);
    } else {
        if (isTacticCustom)
            tactic_tmp = getKeyByValue(myDefendTacticsDict, currentTactic);
        else
            tactic_tmp = tactic_tmp = getKeyByValue(predefDefendTacticsDict, currentTactic);
    }

    var data = {
        type: 'NEW_ROUND',
        tactic: tactic_tmp,
        attacker: attacking,
        myname: localStorage.getItem('username'),
        opponent: localStorage.getItem('opponent'),
        players: {
            p11X: playerPositions.p11X,
            p11Y: playerPositions.p11Y,

            p12X: playerPositions.p12X,
            p12Y: playerPositions.p12Y,

            p13X: playerPositions.p13X,
            p13Y: playerPositions.p13Y,

            p21X: playerPositions.p21X,
            p21Y: playerPositions.p21Y,

            p22X: playerPositions.p22X,
            p22Y: playerPositions.p22Y,

            p23X: playerPositions.p23X,
            p23Y: playerPositions.p23Y,

            playerWithBall: playerWithBall
        }
    };

    var jsonData = JSON.stringify(data);
    server.send(jsonData);
}


/****************************************************************************************** */

function updatePlayerAndBallPositionsOnCourt() {

    var court = document.getElementById("court_grid");

    Array.from(court.children).forEach(cell => {
        if (cell.hasChildNodes()) { // ==> this cell has players
            Array.from(cell.children).forEach(player => {
                console.log("player in cell " + cell.id + " is " + player.id);
                var playerName = "p";
                if (player.id.includes("team1")) {
                    playerName += "1";
                } else {
                    playerName += "2";
                }

                if (player.id.includes("player1")) {
                    playerName += "1";
                } else if (player.id.includes("player2")) {
                    playerName += "2";
                } else {
                    playerName += "3";
                }

                console.log(playerName, "sfsd");
                var newPosition = playerPositions[playerName + "X"] + playerPositions[playerName + "Y"];
                var newCellPos = "cell_" + newPosition;

                console.log("new cell position: " + newCellPos);

                var newCell = document.getElementById(newCellPos);

                if (newCell) {
                    cell.removeChild(player);
                    newCell.appendChild(player);
                }

            });
        }
    });

    if (!whoHasBall.includes("no one")) { //if someone (new) should have the ball now:
        var newPlayerDivWithBall = document.getElementById(whoHasBall + "_div");

        if (newPlayerDivWithBall) {
            var ball_img = document.getElementById("ball_img_id");
            //first: remove the ball as a child from the old ball holder
            var oldBallHolderDIV = document.getElementById("ball_img_id").parentNode;
            if (oldBallHolderDIV) {
                oldBallHolderDIV.removeChild(ball_img);
            }
            //then: add it as a child of the new ball holder
            newPlayerDivWithBall.appendChild(ball_img); //SHOULD CHECK IF THIS WORKS
        }
    }


    //ADDED NOW 
    var court = document.getElementById("court_grid");
    Array.from(court.children).forEach(child => {
        resizePlayersAndBall(child);
    });

}
/****************************** update score *************************************** */
function updateScore() {
    var scoreP = document.getElementById("score_p");
    if (scoreP) {
        scoreP.textContent = "Score " + scoreTEAM1 + "-" + scoreTEAM2;
    }

}

function updateRound() {
    var roundP = document.getElementById("round_p");
    if (roundP) {
        roundP.textContent = "Round " + round;
    }

}

/************************************************************************************ */

function getServerPlayersPos(data) {
    var modData = {};

    data.forEach(dplayer => {
        if (dplayer.includes(PlayersNames.myplayer1 + ",")) {
            var pos = dplayer.split(',');

            //TODO: if left court team 1 else team2  (on all the following ifs)

            if (areWeOntheLeft) {
                modData.p11X = pos[1];
                modData.p11Y = pos[2];
            } else {
                modData.p21X = pos[1];
                modData.p21Y = pos[2];
            }


        }

        if (dplayer.includes(PlayersNames.myplayer2 + ",")) {
            var pos = dplayer.split(',');

            if (areWeOntheLeft) {
                modData.p12X = pos[1];
                modData.p12Y = pos[2];
            } else {
                modData.p22X = pos[1];
                modData.p22Y = pos[2];
            }
        }

        if (dplayer.includes(PlayersNames.myplayer3 + ",")) {
            var pos = dplayer.split(',');

            if (areWeOntheLeft) {
                modData.p13X = pos[1];
                modData.p13Y = pos[2];
            } else {
                modData.p23X = pos[1];
                modData.p23Y = pos[2];
            }
        }

        if (dplayer.includes(PlayersNames.oppplayer1 + ",")) {
            var pos = dplayer.split(',');

            if (areWeOntheLeft) {
                modData.p21X = pos[1];
                modData.p21Y = pos[2];
            } else {
                modData.p11X = pos[1];
                modData.p11Y = pos[2];
            }
        }

        if (dplayer.includes(PlayersNames.oppplayer2 + ",")) {
            var pos = dplayer.split(',');

            if (areWeOntheLeft) {
                modData.p22X = pos[1];
                modData.p22Y = pos[2];
            }
            else {
                modData.p12X = pos[1];
                modData.p12Y = pos[2];
            }
        }

        if (dplayer.includes(PlayersNames.oppplayer3 + ",")) {
            var pos = dplayer.split(',');

            if (areWeOntheLeft) {
                modData.p23X = pos[1];
                modData.p23Y = pos[2];
            } else {
                modData.p13X = pos[1];
                modData.p13Y = pos[2];
            }

        }
    });

    return modData;
}

function replaceName(name) {
    if (name == PlayersNames.myplayer1)
        return "player1_team1";
    if (name == PlayersNames.myplayer2)
        return "player2_team1";
    if (name == PlayersNames.myplayer3)
        return "player3_team1";
    if (name == PlayersNames.oppplayer1)
        return "player1_team2";
    if (name == PlayersNames.oppplayer2)
        return "player2_team2";
    if (name == PlayersNames.oppplayer3)
        return "player3_team2";
}

function areInTheSameTeam(p1, p2) {
    var p1InTeam1 = false;
    if (p1 == PlayersNames.myplayer1 || p1 == PlayersNames.myplayer2 || p1 == PlayersNames.myplayer3)
        p1InTeam1 = true;

    var p2InTeam1 = false;
    if (p2 == PlayersNames.myplayer1 || p2 == PlayersNames.myplayer2 || p2 == PlayersNames.myplayer3)
        p2InTeam1 = true;

    return p1InTeam1 == p2InTeam1;
}

server.onmessage = (evt) => {

    console.log("data received: ", evt.data);
    var modData = {};


    var data = evt.data.split("||");

    if (data[0] == "PLAYER_NAMES") {

        PlayersNames.myplayer1 = data[1];
        PlayersNames.myplayer2 = data[2];
        PlayersNames.myplayer3 = data[3];

        PlayersNames.oppplayer1 = data[4];
        PlayersNames.oppplayer2 = data[5];
        PlayersNames.oppplayer3 = data[6];

        playerPositioning.close();

        return;
    }

    if (data[0] == "Attacking_BeforeDoing") {
        modData.type = "Attacking_BeforeDoing";
        modData.shoot = false;
        modData.pass = false;

        data = data[1].split(">");

        modData = { ...modData, ...getServerPlayersPos(data) };

        if (data.length != 4) {
            if (data[1].includes("shoot")) {
                modData.shoot = true;
                var pName = data[2].split(',')[0].replace("<", "");
                modData.playerShooting = replaceName(pName);
            }

            if (data[1].includes("pass")) {
                modData.pass = true;
                var pName = data[2].split(',')[0].replace("<", "");
                modData.playerPassing = replaceName(pName);
                pName = data[3].split(',')[0].replace("<", "");
                modData.playerReceiving = replaceName(pName);
            }
        }

        console.log("modData Attacking_BeforeDoing ", modData);
    } else if (data[0] == "Attacking_AfterDoing") {
        modData.type = "Attacking_AfterDoing";
        modData.wasShooting = false;
        modData.wasPassing = false;
        modData.newRound = false;

        var splitData = data[1].split(">");

        modData = { ...modData, ...getServerPlayersPos(splitData) };

        if (data[1].includes("shoot")) {
            modData.wasShooting = true;
            var pName = splitData[2].split(',')[0].replace("<", "");
            modData.playerShooting = replaceName(pName);
            if (data[1].includes("<good>")) {
                modData.shootSuccessful = true;
                modData.whoHasBallNow = "no one";
            } else {
                modData.shootSuccessful = false;
                if (data[1].includes("<nogood>")) {
                    modData.whoHasBallNow = replaceName(splitData[splitData.length - 2].replace("<", ""));

                    if (!areInTheSameTeam(pName, splitData[splitData.length - 2].replace("<", ""))) {
                        modData.newRound = true;
                        modData.playerWithBall = modData.whoHasBallNow;
                    }

                } else {
                    //out of play
                    alert("no out of play - should start new round");
                }
            }
        } else {
            modData.wasShooting = false;
        }

        if (data[1].includes("pass")) {
            modData.wasPassing = true;
            var pName = splitData[2].split(',')[0].replace("<", "");
            modData.playerPassing = replaceName(pName);
            pName = splitData[3].split(',')[0].replace("<", "");
            modData.playerReceiving = replaceName(pName);

            if (data[1].includes("<good>")) {
                modData.passSuccessful = true;
                modData.whoHasBallNow = modData.playerReceiving;
            } else {
                if (data[1].includes("<nogood>")) {
                    modData.whoHasBallNow = replaceName(splitData[splitData.length - 2].replace("<", ""));

                    modData.newRound = true;
                    modData.playerWithBall = modData.whoHasBallNow;

                } else {
                    //out of play
                    alert("no out of play - should start new round");
                }
            }
        } else {
            modData.wasPassing = false;
        }

        console.log("modData Attacking_AfterDoing ", modData);

    } else if (data[0] == "Defending_BeforeDoing") {
        modData.type = "Defending_BeforeDoing";
        modData.shoot = false;
        modData.pass = false;

        data = data[1].split(">");

        modData = { ...modData, ...getServerPlayersPos(data) };

        if (data[1].includes("shoot")) {
            modData.shoot = true;
            var pName = data[2].split(',')[0].replace("<", "");
            modData.playerShooting = replaceName(pName);
        }

        if (data[1].includes("pass")) {
            modData.pass = true;
            var pName = data[2].split(',')[0].replace("<", "");
            modData.playerPassing = replaceName(pName);
            pName = data[3].split(',')[0].replace("<", "");
            modData.playerReceiving = replaceName(pName);
        }

        console.log("modData Defending_BeforeDoing ", modData);
    } else if (data[0] == "Defending_AfterDoing") {

        modData.type = "Defending_AfterDoing";
        modData.wasShooting = false;
        modData.wasPassing = false;
        modData.newRound = false;

        var splitData = data[1].split(">");

        if (data[1].includes("shoot")) {
            modData.wasShooting = true;
            var pName = splitData[2].split(',')[0].replace("<", "");
            modData.playerShooting = replaceName(pName);
            if (data[1].includes("<good>")) {
                modData.shootSuccessful = true;
                modData.whoHasBallNow = "no one";
            } else {
                modData.shootSuccessful = false;
                if (data[1].includes("<nogood>")) {
                    modData.whoHasBallNow = replaceName(splitData[splitData.length - 2].replace("<", ""));

                    if (!areInTheSameTeam(pName, splitData[splitData.length - 2].replace("<", ""))) {
                        modData.newRound = true;
                        modData.playerWithBall = modData.whoHasBallNow;
                    }

                } else {
                    //out of play
                    alert("no out of play - should start new round");
                }
            }
        } else {
            modData.wasShooting = false;
        }

        if (data[1].includes("pass")) {
            modData.wasPassing = true;
            var pName = splitData[2].split(',')[0].replace("<", "");
            modData.playerPassing = replaceName(pName);
            pName = splitData[3].split(',')[0].replace("<", "");
            modData.playerReceiving = replaceName(pName);

            if (data[1].includes("<good>")) {
                modData.passSuccessful = true;
                modData.whoHasBallNow = modData.playerReceiving;
            } else {
                if (data[1].includes("<nogood>")) {
                    modData.whoHasBallNow = replaceName(splitData[splitData.length - 2].replace("<", ""));
                    modData.newRound = true;
                    modData.playerWithBall = modData.whoHasBallNow;

                } else {
                    //out of play
                    alert("no out of play - should start new round");
                }
            }
        } else {
            modData.wasPassing = false;
        }

        console.log("modData Defending_AfterDoing ", modData);
    } else if (data[0] == "Round_Changed") {
        modData = {
            type: "Round_Changed",
            whoWillAttack: data[1],
            team1Score: data[2],
            team2Score: data[3],
            teamScored: data[4] == "1"
        };
    } else if (data[0] == "END_GAME") {
        modData = {
            type: "END_GAME",
            whoWon: data[1]
        };
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    if (modData.type == "Attacking_BeforeDoing") {

        var shoot = modData.shoot;
        var playerShooting = -1;

        if (shoot) {
            playerShooting = modData.playerShooting.replace("player", "").replace("_team", "")[0]; //player1_team1
        }

        var pass = modData.pass;
        var playerPassing = -1;
        var playerReceiving = -1;
        if (pass) {
            playerPassing = modData.playerPassing.replace("player", "").replace("_team", "")[0];
            playerReceiving = modData.playerReceiving.replace("player", "").replace("_team", "")[0];
        }


        if (playerPositions.p11X != modData.p11X || playerPositions.p11Y != modData.p11Y) {
            playerPositions.p11X = modData.p11X;
            playerPositions.p11Y = modData.p11Y;

            textForDisplay.player1 = "Player 1 moves to <" + playerPositions.p11X + ", " + playerPositions.p11Y + ">, ";

        } else if (shoot && playerShooting == 1) {
            textForDisplay.player1 = "Player 1 shoots, ";
        } else if (pass && playerPassing == 1) {
            textForDisplay.player1 = "Player 1 passes to Player " + playerReceiving + ", ";
        } else {
            textForDisplay.player1 = "Player 1 does nothing, ";
        }


        if (playerPositions.p12X != modData.p12X || playerPositions.p12Y != modData.p12Y) {
            playerPositions.p12X = modData.p12X;
            playerPositions.p12Y = modData.p12Y;

            textForDisplay.player2 = "Player 2 moves to <" + playerPositions.p12X + ", " + playerPositions.p12Y + ">, ";

        } else if (shoot && playerShooting == 2) {
            textForDisplay.player2 = "Player 2 shoots, ";
        } else if (pass && playerPassing == 2) {
            textForDisplay.player2 = "Player 2 passes to Player " + playerReceiving + ", ";
        } else {
            textForDisplay.player2 = "Player 2 does nothing, ";
        }


        if (playerPositions.p13X != modData.p13X || playerPositions.p13Y != modData.p13Y) {
            playerPositions.p13X = modData.p13X;
            playerPositions.p13Y = modData.p13Y;

            textForDisplay.player3 = "Player 3 moves to <" + playerPositions.p13X + ", " + playerPositions.p13Y + ">";

        } else if (shoot && playerShooting == 3) {
            textForDisplay.player3 = "Player 3 shoots";
        } else if (pass && playerPassing == 3) {
            textForDisplay.player3 = "Player 3 passes to Player " + playerReceiving;
        } else {
            textForDisplay.player3 = "Player 3 does nothing";
        }

        var instructions_text = document.getElementById('instructions_text');

        instructions_text.textContent = textForDisplay.player1 + textForDisplay.player2 + textForDisplay.player3;


    } else if (modData.type == "Attacking_AfterDoing") {
        //get modified data for what I did succesfully, AND what the other team did - after the fact




        var instructions_text = document.getElementById('instructions_text');

        var wasShooting = modData.wasShooting;
        var shootSuccessful = false;
        var playerShooting = -1;
        var whoHasBallNow = whoHasBall;
        var playerNumWithBall = -1;

        if (wasShooting) {
            shootSuccessful = modData.shootSuccessful;
            playerShooting = modData.playerShooting.replace("player", "").replace("_team", "")[0];
            whoHasBallNow = modData.whoHasBallNow; // player1_team1
            playerNumWithBall = whoHasBallNow.replace("player", "").replace("_team", "");
        }

        var wasPassing = modData.wasPassing;
        var passSuccessful = false;
        var playerPassing = -1;
        var playerReceiving = -1;

        if (wasPassing) {
            passSuccessful = modData.passSuccessful;
            playerPassing = modData.playerPassing.replace("player", "").replace("_team", "")[0];
            playerReceiving = modData.playerReceiving.replace("player", "").replace("_team", "")[0];
            whoHasBallNow = modData.whoHasBallNow; // player1_team1
            playerNumWithBall = whoHasBallNow.replace("player", "").replace("_team", "");
        }


        playerPositions.p21X = modData.p21X;
        playerPositions.p21Y = modData.p21Y;

        playerPositions.p22X = modData.p22X;
        playerPositions.p22Y = modData.p22Y;

        playerPositions.p23X = modData.p23X;
        playerPositions.p23Y = modData.p23Y;


        if (wasShooting) {
            if (shootSuccessful) {
                textForDisplay["player" + playerShooting] = "Player " + playerShooting + " shoots succesfully! "
            } else {
                textForDisplay["player" + playerShooting] = "Player " + playerShooting + " shoots unsuccesfully! Player " + playerNumWithBall[0] + " of team " + playerNumWithBall[1] + " has the ball now! "
            }
        }

        if (wasPassing) {
            if (passSuccessful) {
                textForDisplay["player" + playerPassing] = "Player " + playerPassing + " passess succesfully to Player " + playerReceiving + "! "
            } else {
                textForDisplay["player" + playerPassing] = "Player " + playerPassing + " passess unsuccesfully! Player " + playerNumWithBall[0] + " of team " + playerNumWithBall[1] + " has the ball now! "
            }
        }

        if (whoHasBall != whoHasBallNow) {

            whoHasBall = whoHasBallNow;
        }

        instructions_text.textContent = textForDisplay.player1 + textForDisplay.player2 + textForDisplay.player3;

        updatePlayerAndBallPositionsOnCourt();

        // NEW ROUND - I was attacking, now I will defend
        if (modData.newRound) {
            var roundAsNum = parseInt(round);
            roundAsNum += 1;
            round = roundAsNum;
            localStorage.setItem("round", round);
            updateRound();

            var newPlayerWithBall = modData.playerWithBall;
            whoHasBall = newPlayerWithBall;

            attacking = false;
            localStorage.setItem("attacking", attacking);

            alert("You lost the ball! The other Team has the ball and you are defending now! Choose your tactic!")
            defendModal.style.display = "block";

        }

    } else if (modData.type == "Defending_BeforeDoing") {
        //when I'm defending, before the fact - BUT I know what the other team will try to do + what I will do

        var shoot = modData.shoot;
        var playerShooting = -1;

        if (shoot) {
            playerShooting = modData.playerShooting.replace("player", "").replace("_team", "")[0];
        }

        var pass = modData.pass;
        var playerPassing = -1;
        var playerReceiving = -1;

        if (pass) {
            playerPassing = modData.playerPassing.replace("player", "").replace("_team", "")[0];
            playerReceiving = modData.playerReceiving.replace("player", "").replace("_team", "")[0];
        }



        /********************************** TEAM 1 *************************************** */

        if (playerPositions.p11X != modData.p11X || playerPositions.p11Y != modData.p11Y) {
            playerPositions.p11X = modData.p11X;
            playerPositions.p11Y = modData.p11Y;

            textForDisplay.player1 = "Player 1 moves to <" + playerPositions.p11X + ", " + playerPositions.p11Y + ">, ";
        } else {
            textForDisplay.player1 = "Player 1 does nothing, ";
        }


        if (playerPositions.p12X != modData.p12X || playerPositions.p12Y != modData.p12Y) {
            playerPositions.p12X = modData.p12X;
            playerPositions.p12Y = modData.p12Y;

            textForDisplay.player2 = "Player 2 moves to <" + playerPositions.p12X + ", " + playerPositions.p12Y + ">, ";
        } else {
            textForDisplay.player2 = "Player 2 does nothing, ";
        }


        if (playerPositions.p13X != modData.p13X || playerPositions.p13Y != modData.p13Y) {
            playerPositions.p13X = modData.p13X;
            playerPositions.p13Y = modData.p13Y;

            textForDisplay.player3 = "Player 3 moves to <" + playerPositions.p13X + ", " + playerPositions.p13Y + ">";
        } else {
            textForDisplay.player3 = "Player 3 does nothing";
        }

        var instructions_text = document.getElementById('instructions_text');

        instructions_text.textContent = textForDisplay.player1 + textForDisplay.player2 + textForDisplay.player3;


        /********************************** TEAM 2 *************************************** */

        var opponent_info_text = document.getElementById('opponent_info_text');


        if (playerPositions.p21X != modData.p21X || playerPositions.p21Y != modData.p21Y) {
            playerPositions.p21X = modData.p21X;
            playerPositions.p21Y = modData.p21Y;

            opponentInfoText.player1 = "Player 1 moves to <" + playerPositions.p21X + ", " + playerPositions.p21Y + ">, ";

        } else if (shoot && playerShooting == 1) {
            opponentInfoText.player1 = "Player 1 shoots, ";
        } else if (pass && playerPassing == 1) {
            opponentInfoText.player1 = "Player 1 passes to Player " + playerReceiving + ", ";
        } else {
            opponentInfoText.player1 = "Player 1 does nothing, ";
        }


        if (playerPositions.p22X != modData.p22X || playerPositions.p22Y != modData.p22Y) {
            playerPositions.p22X = modData.p22X;
            playerPositions.p22Y = modData.p22Y;

            opponentInfoText.player2 = "Player 2 moves to <" + playerPositions.p22X + ", " + playerPositions.p22Y + ">, ";

        } else if (shoot && playerShooting == 2) {
            opponentInfoText.player2 = "Player 2 shoots, ";
        } else if (pass && playerPassing == 2) {
            opponentInfoText.player2 = "Player 2 passes to Player " + playerReceiving + ", ";
        } else {
            opponentInfoText.player2 = "Player 2 does nothing, ";
        }


        if (playerPositions.p23X != modData.p23X || playerPositions.p23Y != modData.p23Y) {
            playerPositions.p23X = modData.p23X;
            playerPositions.p23Y = modData.p23Y;

            opponentInfoText.player3 = "Player 3 moves to <" + playerPositions.p23X + ", " + playerPositions.p23Y + ">";

        } else if (shoot && playerShooting == 3) {
            opponentInfoText.player3 = "Player 3 shoots";
        } else if (pass && playerPassing == 3) {
            opponentInfoText.player3 = "Player 3 passes to Player " + playerReceiving;
        } else {
            opponentInfoText.player3 = "Player 3 does nothing";
        }


        opponent_info_text.textContent = "Team 2: " + opponentInfoText.player1 + opponentInfoText.player2 + opponentInfoText.player3;


    } else if (modData.type == "Defending_AfterDoing") {  //after the fact - I know what I did, what the other player did + if it was succesful


        var opponent_info_text = document.getElementById('opponent_info_text');

        var wasShooting = modData.wasShooting;
        var shootSuccessful = false;
        var playerShooting = -1;
        var whoHasBallNow = whoHasBall;
        var playerNumWithBall = -1;

        if (wasShooting) {
            shootSuccessful = modData.shootSuccessful;
            playerShooting = modData.playerShooting.replace("player", "").replace("_team", "")[0];
            whoHasBallNow = modData.whoHasBallNow; // player1_team1
            playerNumWithBall = whoHasBallNow.replace("player", "").replace("_team", "");
        }

        var wasPassing = modData.wasPassing;
        var passSuccessful = false;
        var playerPassing = -1;
        var playerReceiving = -1;

        if (wasPassing) {
            passSuccessful = modData.passSuccessful;
            playerPassing = modData.playerPassing.replace("player", "").replace("_team", "")[0];
            playerReceiving = modData.playerReceiving.replace("player", "").replace("_team", "")[0];
            whoHasBallNow = modData.whoHasBallNow; // player1_team1
            playerNumWithBall = whoHasBallNow.replace("player", "").replace("_team", "");
        }


        if (wasShooting) {
            if (shootSuccessful) {
                opponentInfoText["player" + playerShooting] = "Player " + playerShooting + " shoots succesfully! "
            } else {
                opponentInfoText["player" + playerShooting] = "Player " + playerShooting + " shoots unsuccesfully! Player " + playerNumWithBall[0] + " of team " + playerNumWithBall[1] + " has the ball now! "
            }
        }

        if (wasPassing) {
            if (passSuccessful) {
                opponentInfoText["player" + playerPassing] = "Player " + playerPassing + " passess succesfully to Player " + playerReceiving + "! "
            } else {
                opponentInfoText["player" + playerPassing] = "Player " + playerPassing + " passess unsuccesfully! Player " + playerNumWithBall[0] + " of team " + playerNumWithBall[1] + " has the ball now! "
            }
        }

        if (whoHasBall != whoHasBallNow) {

            whoHasBall = whoHasBallNow;
        }

        opponent_info_text.textContent = "Team 2: " + opponentInfoText.player1 + opponentInfoText.player2 + opponentInfoText.player3;

        updatePlayerAndBallPositionsOnCourt();

        // NEW ROUND - I was defending, now I will attack
        if (modData.newRound) {
            var roundAsNum = parseInt(round);
            roundAsNum += 1;
            round = roundAsNum;
            localStorage.setItem("round", round);
            updateRound();

            var newPlayerWithBall = modData.playerWithBall;
            whoHasBall = newPlayerWithBall;

            attacking = true;
            localStorage.setItem("attacking", attacking);

            alert("The other team lost the ball! You have the ball and you are attacking now! Choose your tactic!")
            attackModal.style.display = "block";

        }


    } else if (modData.type == "Round_Changed") {
        //regardless if attacking or defending: ROUND CHANGED
        //2 ways to end up here: 1) after ball goes out of play 2) after succesful shoot of a team


        scoreTEAM1 = modData.team1Score;
        scoreTEAM2 = modData.team2Score;
        updateScore();
        //we will load the window anew = lose info not stored in local storage
        localStorage.setItem("attacking", attacking);
        localStorage.setItem("scoreTEAM1", scoreTEAM1);
        localStorage.setItem("scoreTEAM2", scoreTEAM2);
        var roundAsNum = parseInt(round);
        roundAsNum += 1;
        round = roundAsNum;
        localStorage.setItem("round", round);

        var whoWillAttackNow = modData.whoWillAttack;
        var IwillAttack = whoWillAttackNow == TeamNames.team1Name;


        attacking = whoWillAttackNow == TeamNames.team1Name;

        var whohasball2show = whoHasBall.replace("player", "").replace("_team", "")[0];

        if (modData.teamScored) { //i am here because of a succesful shoot
            if (attacking) {
                if (IwillAttack) {
                    alert("Player " + whohasball2show + " shoots succesfully! HURRAY! Press OK to start new round (You have the ball in the new round).");
                } else {
                    alert("Player " + whohasball2show + " shoots succesfully! HURRAY! Press OK to start new round (The other team has the ball in the new round).");
                }
            } else {
                if (IwillAttack) {
                    alert("Player " + whohasball2show + " of Team 2 shoots succesfully! :( Press OK to start new round (You have the ball in the new round).");
                } else {
                    alert("Player " + whohasball2show + " of Team 2 shoots succesfully! :( Press OK to start new round (The other team has the ball in the new round).");
                }
            }

        } else { //i am here because the ball is out of play
            if (IwillAttack) {
                alert("Ball out of play! Press OK to start new round (You have the ball in the new round).");
            } else {
                alert("Ball out of play! Press OK to start new round (The other team has the ball in the new round).");
            }
        }

        newRound();
        // window.location = "court.html" //and start again - setting the positions of the players and the ball

    } else if (modData.type == "END_GAME") {
        /*
         modData = {
            type: "END_GAME",
            whoWon : data[1]
        };
        */

        if (modData.whoWon == TeamNames.team1Name) {
            alert("THE GAME HAS ENDED! You won! HURRAY! :D The score is " + localStorage.getItem('scoreTEAM1') + "-" + localStorage.getItem('scoreTEAM1') + ". Press OK to restart game.");
        } else {
            alert("THE GAME HAS ENDED! The other team won! :( Better luck next time... The score is " + localStorage.getItem('scoreTEAM1') + "-" + localStorage.getItem('scoreTEAM1') + ". Press OK to restart game.");
        }

        localStorage.removeItem("round");
        localStorage.removeItem("scoreTEAM1");
        localStorage.removeItem("scoreTEAM2");
        localStorage.removeItem("attacking");

        window.location = "index.html";

    }

}

/****************************************************************************************** */

function onStartGameAfterSelectTactic() {

    if (round < 2) {
        onStart();
    }
    else {
        onNewRound();
    }

    var info_my_tactic_div = document.getElementById('info_my_tactic_div');
    var info_attacking_or_defending_div = document.getElementById('info_attacking_or_defending_div');
    var info_opponent_moves_div = document.getElementById('info_opponent_moves_div');

    info_my_tactic_div.style.display = "flex";
    info_attacking_or_defending_div.style.display = "flex";

    info_my_tactic_div.innerHTML = '<img class="info_down_imgs" src="Resources/thinking_mind.png"/> <p class="p_info"> Your tactic is: ' + currentTactic + ' </p>'

    if (attacking) {
        //start the game in attack mode
        attackModal.style.display = "none";

        document.getElementById("team1_title").style.display = "none";
        document.getElementById("team2_title").style.display = "none";
        document.getElementById('go_btn_players_placed').style.display = "none";

        info_opponent_moves_div.style.display = "none";
        info_attacking_or_defending_div.innerHTML = '<img class="info_down_imgs" src="Resources/sword.png"/> <p class="p_info"> You are attacking </p>'

    } else {
        //start the game in defend mode
        defendModal.style.display = "none";

        document.getElementById("team1_title").style.display = "none";
        document.getElementById("team2_title").style.display = "none";
        document.getElementById('go_btn_players_placed').style.display = "none";

        info_opponent_moves_div.style.display = "flex";
        info_attacking_or_defending_div.innerHTML = '<img class="info_down_imgs" src="Resources/shield.png"/> <p class="p_info"> You are defending </p>'

    }

}

/**************************************************************** */
function tacticChosen(tactic) {
    var tacticSelected = tactic.innerHTML;
    console.log("TACTIC CHOSEN: " + tacticSelected);

    var type = "";
    if ($(tactic).hasClass('predef')) {
        type = 'predefined';
    } else {
        type = 'my';
    }

    console.log("tactic type: " + type);

    //check if sth else was green before to make it yellow again
    var myTacticsDiv;
    if (attacking) {
        predefTacticsDiv = document.getElementById("div_with_predefined_attack_tactics_btns");
        myTacticsDiv = document.getElementById("div_with_my_attack_tactics_btns");

    } else {
        predefTacticsDiv = document.getElementById("div_with_predefined_defend_tactics_btns");
        myTacticsDiv = document.getElementById("div_with_my_defend_tactics_btns");

    }

    Array.from(predefTacticsDiv.children).forEach(tacticBtn => {
        if (tacticBtn.classList.contains('tactics')) {
            Array.from(tacticBtn.children).forEach(tacticTXT => {
                if (tacticTXT.classList.contains("tactics_text")) {
                    tacticTXT.style.borderColor = "#E5A61C";
                }
            });
        }
    });

    Array.from(myTacticsDiv.children).forEach(tacticBtn => {
        if (tacticBtn.classList.contains('tactics')) {
            Array.from(tacticBtn.children).forEach(tacticTXT => {
                if (tacticTXT.classList.contains("tactics_text")) {
                    tacticTXT.style.borderColor = "#E5A61C";
                }
            });
        }
    });

    tactic.style.borderColor = "green";
    currentTactic = tacticSelected;
    isTacticCustom = type == 'my';
}


function onOKclick() {
    var placementAlertModal = document.getElementById('placementAlertModal');
    placementAlertModal.style.display = 'none';
}

function populateTacticsModal(attacking) {
    var divToPopulate;
    var tacticsDictionary;
    if (attacking) {
        divToPopulate = document.getElementById('div_with_my_attack_tactics_btns');
        tacticsDictionary = myAttackTacticsDict;
    } else {
        divToPopulate = document.getElementById('div_with_my_defend_tactics_btns');
        tacticsDictionary = myDefendTacticsDict;
    }

    for (var key in tacticsDictionary) {
        var newTacticDiv = document.createElement('div');
        newTacticDiv.setAttribute('class', 'tactics align_middle');

        divToPopulate.appendChild(newTacticDiv);

        newTacticDiv.innerHTML = '<p class="solid tactics_text" role="button"  onclick="tacticChosen(this)">' + tacticsDictionary[key] + '</p>';
    }

}



function displayTacticsDiv() {
    var attackModal = document.getElementById('attackModal');
    var defendModal = document.getElementById('defendModal');

    var court = document.getElementById("court_grid");


    var players_div2check;
    if (areWeOntheLeft) {
        players_div2check = 'players_team1_div';

        var myPlayer1_posY = document.getElementById('player1_team1_div').parentNode.id.replace("cell_", "")[1];
        var myPlayer2_posY = document.getElementById('player2_team1_div').parentNode.id.replace("cell_", "")[1];
        var myPlayer3_posY = document.getElementById('player3_team1_div').parentNode.id.replace("cell_", "")[1];

        if (myPlayer1_posY > 4 || myPlayer2_posY > 4 || myPlayer3_posY > 4) {
            document.getElementById('placementAlertModal').style.display = 'block';
            document.getElementById('alert_placement_text_id').innerText = "You must place all your players on the LEFT side of the court!";
            return;
        }

    } else {
        players_div2check = 'players_team2_div';

        var myPlayer1_posY = document.getElementById('player1_team2_div').parentNode.id.replace("cell_", "")[1];
        var myPlayer2_posY = document.getElementById('player2_team2_div').parentNode.id.replace("cell_", "")[1];
        var myPlayer3_posY = document.getElementById('player3_team2_div').parentNode.id.replace("cell_", "")[1];

        if (myPlayer1_posY < 5 || myPlayer2_posY < 5 || myPlayer3_posY < 5) {
            document.getElementById('placementAlertModal').style.display = 'block';
            document.getElementById('alert_placement_text_id').innerText = "You must place all your players on the RIGHT side of the court!";
            return;
        }
    }

    if (attacking) {
        if (($('#' + players_div2check).find('img').length > 0) || ($('#ball_img_id_div').find('img').length > 0)) {
            document.getElementById('placementAlertModal').style.display = 'block';
            document.getElementById('alert_placement_text_id').innerText = "You must place all players on the court and assign the ball to a player!";
            return;
        }

        attackModal.style.display = "block";
    } //else we are defending
    else {
        if ($('#' + players_div2check).find('img').length > 0) {
            document.getElementById('placementAlertModal').style.display = 'block';
            document.getElementById('alert_placement_text_id').innerText = "You must place all players on the court!";
            return;
        }

        defendModal.style.display = "block";
    }

    document.getElementById("instructions_text").innerHTML = "Waiting for the other team to place their players";
    populateTacticsModal(attacking);

}


function loadTactics() {

    TacticsManager.getTactics(localStorage.getItem('username'))
        .then((tcs) => {

            tcs.forEach(tc => {
                if (tc.type == 'attack') {
                    myAttackTacticsDict[tc.path] = tc.name;
                } else {
                    myDefendTacticsDict[tc.path] = tc.name;
                }
            });


        })
        .catch((err) => {
            console.log('couldnt load tactics');
        });

}


/*********************************************************************************************** */

window.onload = function () {

    console.log('areWeOntheLeft? : ' + areWeOntheLeft);
    console.log('attacking? : ' + attacking);

    loadTactics();

    /***************************** info for instruction box on top ********************************** */
    var instructions_text = "";

    console.log('me? : ' + localStorage.getItem('username'));
    console.log('opp? : ' + localStorage.getItem('opponent'));

    /********************** set the correct team names and who is draggable and who is not ******************************* */
    if (areWeOntheLeft) {
        instructions_text = "You are on the left side of the court ";

        document.getElementById('team1_title').innerText = localStorage.getItem('username') + " team";
        document.getElementById('team2_title').innerText = localStorage.getItem('opponent') + " team";

        document.getElementById('player1_team2_div').draggable = false;
        document.getElementById('player2_team2_div').draggable = false;
        document.getElementById('player3_team2_div').draggable = false;

        document.getElementById('player1_team1_div').draggable = true;
        document.getElementById('player2_team1_div').draggable = true;
        document.getElementById('player3_team1_div').draggable = true;

        document.getElementById('player1_team1_div').ondragstart = drag;
        document.getElementById('player2_team1_div').ondragstart = drag;
        document.getElementById('player3_team1_div').ondragstart = drag;

        document.getElementById('player1_team1_div').ondrop = drop;
        document.getElementById('player2_team1_div').ondrop = drop;
        document.getElementById('player3_team1_div').ondrop = drop;

        document.getElementById('player1_team1_div').ondragover = allowDrop;
        document.getElementById('player2_team1_div').ondragover = allowDrop;
        document.getElementById('player3_team1_div').ondragover = allowDrop;

    } else {
        instructions_text = "You are on the right side of the court ";

        document.getElementById('team2_title').innerText = localStorage.getItem('username') + " team";
        document.getElementById('team1_title').innerText = localStorage.getItem('opponent') + " team";

        document.getElementById('player1_team1_div').draggable = false;
        document.getElementById('player2_team1_div').draggable = false;
        document.getElementById('player3_team1_div').draggable = false;

        document.getElementById('player1_team2_div').draggable = true;
        document.getElementById('player2_team2_div').draggable = true;
        document.getElementById('player3_team2_div').draggable = true;

        document.getElementById('player1_team2_div').ondragstart = drag;
        document.getElementById('player2_team2_div').ondragstart = drag;
        document.getElementById('player3_team2_div').ondragstart = drag;

        document.getElementById('player1_team2_div').ondrop = drop;
        document.getElementById('player2_team2_div').ondrop = drop;
        document.getElementById('player3_team2_div').ondrop = drop;

        document.getElementById('player1_team2_div').ondragover = allowDrop;
        document.getElementById('player2_team2_div').ondragover = allowDrop;
        document.getElementById('player3_team2_div').ondragover = allowDrop;

    }

    if (attacking) {
        document.getElementById('ball_img_id').draggable = true;
        instructions_text += "and you are attacking! Place your team on the court and give the ball to one of your players. Then press GO";

    } else {
        document.getElementById('ball_img_id').draggable = false;
        instructions_text += "and you are defending! Place your team on the court, and then press GO";
    }

    document.getElementById('instructions_text').textContent = instructions_text;

    /********************** For SCORE and ROUND ******************************* */
    if (round == -1) {
        var localRound = localStorage.getItem("round");
        if (localRound) {
            if (localRound != -1) {
                round = localRound;
            } else {
                round = 1;
                localStorage.setItem("round", round);
            }
        } else {
            round = 1;
            localStorage.setItem("round", round);
        }
    }

    if (scoreTEAM1 == -1) {
        var localscoreTEAM1 = localStorage.getItem("scoreTEAM1");
        if (localscoreTEAM1) {
            if (localscoreTEAM1 != -1) {
                scoreTEAM1 = localscoreTEAM1;
            } else {
                scoreTEAM1 = 0;
                localStorage.setItem("scoreTEAM1", scoreTEAM1);
            }
        } else {
            scoreTEAM1 = 0;
            localStorage.setItem("scoreTEAM1", scoreTEAM1);
        }
    }

    if (scoreTEAM2 == -1) {
        var localscoreTEAM2 = localStorage.getItem("scoreTEAM2");
        if (localscoreTEAM2) {
            if (localscoreTEAM2 != -1) {
                scoreTEAM2 = localscoreTEAM2;
            } else {
                scoreTEAM2 = 0;
                localStorage.setItem("scoreTEAM2", scoreTEAM2);
            }
        } else {
            scoreTEAM2 = 0;
            localStorage.setItem("scoreTEAM2", scoreTEAM2);
        }
    }

    updateRound();
    updateScore();

    //////////////////////////////////////////////////////////////////////////////


    var attackModal = document.getElementById('attackModal');
    var defendModal = document.getElementById('defendModal');

    var placementAlertModal = document.getElementById('placementAlertModal');

    var span = document.getElementsByClassName("close");

    // When the user clicks on <span> (x), close the modal
    if (span) {
        Array.from(span).forEach(possible_X => {
            possible_X.onclick = function () {
                attackModal.style.display = "none";
                defendModal.style.display = "none";
                placementAlertModal.style.display = "none";
            }
        });
    }


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == attackModal) {
            attackModal.style.display = "none";
        }

        if (event.target == defendModal) {
            defendModal.style.display = "none";
        }

        if (event.target == placementAlertModal) {
            placementAlertModal.style.display = "none";
        }

    }

};

/* ----------------------------------------- */

function resetUI() {
    document.getElementById("team1_title").style.display = "block";
    document.getElementById("team2_title").style.display = "block";
    document.getElementById('go_btn_players_placed').style.display = "block";

    var info_my_tactic_div = document.getElementById('info_my_tactic_div');
    var info_attacking_or_defending_div = document.getElementById('info_attacking_or_defending_div');
    var info_opponent_moves_div = document.getElementById('info_opponent_moves_div');

    info_my_tactic_div.style.display = "none";
    info_attacking_or_defending_div.style.display = "none";
    info_opponent_moves_div.style.display = "none";
}

function resetData() {
    currentTactic = "";
    isTacticCustom = false;

    textForDisplay = {
        player1: "",
        player2: "",
        player3: ""
    };

    opponentInfoText = {
        player1: "",
        player2: "",
        player3: ""
    };

    playerPositions = {
        p11X: 0,
        p11Y: 0,

        p12X: 0,
        p12Y: 0,

        p13X: 0,
        p13Y: 0,

        p21X: 0,
        p21Y: 0,

        p22X: 0,
        p22Y: 0,

        p23X: 0,
        p23Y: 0,
    };

    whoHasBall = "no one";
}

function resetPlayers() {
    $('#player1_team1_div').appendTo($("#p11off"));
    $('#player2_team1_div').appendTo($("#p21off"));
    $('#player3_team1_div').appendTo($("#p31off"));

    $('#player1_team2_div').appendTo($("#p12off"));
    $('#player2_team2_div').appendTo($("#p22off"));
    $('#player3_team2_div').appendTo($("#p32off"));



    $('#ball_img_id_div').append($('#ball_img_id'));

    $('#ball_img_id').css('width', '57px');
    $('#ball_img_id').css('height', '57px');
    $('#ball_img_id').css('margin-left', '0');
    $('#ball_img_id').css('margin-bottom', '0');

}

function newRound() {
    resetUI();
    resetData();
    resetPlayers();


    playerPositioning.connect(localStorage.getItem('username'));

    window.onload();
}