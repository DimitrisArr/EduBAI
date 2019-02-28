/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package GameManager;

import Communication.Client;
import Communication.SportsCaster;
import Executor.ASPExecutor;
import GameData.TeamData;

/**
 *
 * @author aramp
 */
public class GameMaster {

    private int team1Score = 0;
    private int team2Score = 0;

    private int timepoint = 0;

    private String player1name;
    private String player2name;
    private boolean player1Attacks;

    boolean isPlayer1ready = false;
    boolean isPlayer2ready = false;
    boolean endOfGame = false;

    public GameMaster(String player1Name, String player2Name) {
        this.player1name = player1Name;
        this.player2name = player2Name;
    }

    private void updateAttacker() {
        player1Attacks = GamePlayersManager.Instance().getData(player1name).attacker;
    }

    private boolean checkNewRound() {
        boolean newRound = true;

        if (team1Score >= 15) {
            Client.sendMessage(player1name, "END_GAME||" + player1name);
            Client.sendMessage(player2name, "END_GAME||" + player1name);
            endOfGame = true;
            return true;
        } else if (team2Score >= 15) {
            Client.sendMessage(player1name, "END_GAME||" + player2name);
            Client.sendMessage(player2name, "END_GAME||" + player2name);
            endOfGame = true;
            return true;
        }

        if (!isPlayer1ready) {
            isPlayer1ready = GamePlayersManager.Instance().getData(player1name).getIfDataIsSetAndUpdate();
        }
        if (!isPlayer2ready) {
            isPlayer2ready = GamePlayersManager.Instance().getData(player2name).getIfDataIsSetAndUpdate();
        }

        if (isPlayer1ready && isPlayer2ready) {
            isPlayer1ready = false;
            isPlayer2ready = false;
            newRound = false;
            updateAttacker();
            System.out.println("A new round is about to start.");
            timepoint = 0;
        } else {
            System.out.println("Waiting for new round..");
        }

        return newRound;
    }

    public boolean playOfficialMatchNew() {
        System.out.println("------------");
        boolean newRound = true;
        while (!endOfGame) {

            if (newRound) {
                newRound = checkNewRound();
            } else {

                String attacker = player1Attacks ? player1name : player2name;
                String defender = player1Attacks ? player2name : player1name;

                System.out.println("asdasda");

                String atcData = executeAttackASP(attacker);
                String results = executeDefenceASP(defender, atcData); //result contain both data
                updateOppPlayerData(attacker, results);

                if (areOnlyMoves(results)) {
                    System.out.println("-. Sending defending results to opponent");
                    System.out.println("-. Sent defending results to opponent");

                    System.out.println("-. Sending Defending AfterDoing Message to UI");
                    Client.sendMessage(defender, "Defending_AfterDoing||" + results);
                    System.out.println("-. Sent Defending AfterDoing Message to UI");

                    System.out.println("-. Received game data for the attack from the opponent: " + results);

                    System.out.println("-. Sending Attacking AfterDoing Message to UI");
                    Client.sendMessage(attacker, "Attacking_AfterDoing||" + results);
                    System.out.println("-. Sent Attacking BeforeDoing Message to UI");

                } else {
                    //there was a pass or shoot
                    results += runSportCaster(results);
                    updateBallHolder(results);

                    System.out.println("-. Sending defending results to opponent");
                    System.out.println("-. Sent defending results to opponent");

                    System.out.println("-. Received game data for the attack from the opponent: " + results);

                    newRound = checkForNewRound(results);
                }

                timepoint += 1;
            }

            try {
                Thread.sleep(10000);//3 seconds
                System.out.print(".");
            } catch (InterruptedException ie) {
                ie.printStackTrace();
            }

        }

        return false;
    }

    private boolean checkForNewRound(String results) {
        String attacker = player1Attacks ? player1name : player2name;
        String defender = player1Attacks ? player2name : player1name;

        GamePlayer gp = GamePlayersManager.Instance().getData(attacker);

        if (results.contains("<outofplay>") || (results.contains("<shoot") && results.contains("<good>"))) {

            if (results.contains("<shoot") && results.contains("<good>")) {
                int addScore = 0;
                switch (gp.players.playerWithBall) {
                    case 1:
                        addScore += calculateScore(gp.players.p11X, gp.players.p11Y, !gp.courtLeft);
                        break;
                    case 2:
                        addScore += calculateScore(gp.players.p12X, gp.players.p12Y, !gp.courtLeft);
                        break;
                    case 3:
                        addScore += calculateScore(gp.players.p13X, gp.players.p13Y, !gp.courtLeft);
                        break;
                    default:
                        break;
                }
                if (player1name.equals(attacker)) {
                    team1Score += addScore;
                } else {
                    team2Score += addScore;
                }
            }

            System.out.println("-. Sending new round Message to UI -- " + attacker);
            Client.sendMessage(attacker, "Round_Changed||" + defender + "||" + team1Score + "||" + team2Score + "||" + (results.contains("<outofplay>") ? "0" : "1"));
            System.out.println("-. Sent new round Message to UI");

            System.out.println("-. Sending new round Message to UI -- " + defender);
            Client.sendMessage(defender, "Round_Changed||" + defender + "||" + team1Score + "||" + team2Score + "||" + (results.contains("<outofplay>") ? "0" : "1"));
            System.out.println("-. Sent new round Message to UI");

            return true;
        } else {
            //send what happened do to UI
            System.out.println("-. Sending Attacking AfterDoing Message to UI");
            Client.sendMessage(attacker, "Attacking_AfterDoing||" + results);
            System.out.println("-. Sent Attacking BeforeDoing Message to UI");

            //send result to UI
            System.out.println("-. Sending Defending AfterDoing Message to UI");
            Client.sendMessage(defender, "Defending_AfterDoing||" + results);
            System.out.println("-. Sent Defending AfterDoing Message to UI");
        }

        if (results.contains("<pass>") && !results.contains("<good>")) {
            return true;
        }

        if (results.contains("shoot") && results.contains("<nogood>")) {
            String[] bh = results.split("<nogood>");
            String ballHolderName = bh[1].replace("<", "").replace(">", "");
            if ((player1Attacks && !TeamData.isInTeam1(ballHolderName)) || (!player1Attacks && TeamData.isInTeam1(ballHolderName))) {
                return true;
            }
        }

        return false;
    }

    private String executeAttackASP(String playerName) {
        GamePlayer gp = GamePlayersManager.Instance().getData(playerName);

        System.out.println("-. Running ASP as an attacker");
        System.out.println("data before asp attack- " + gp.players.toString());
        String atcData = ASPExecutor.Instance().executeAttack(gp.players, timepoint, gp.tactic, gp.courtLeft, playerName, playerName.equals(player1name));
        System.out.println("-. ASP result for attack : " + atcData);

        updatePlayerOwnData(playerName, atcData);

        System.out.println("data after asp attack - " + gp.players.toString());

        //send what will do to UI
        System.out.println("-. Sending Attacking BeforeDoing Message to UI");
        Client.sendMessage(playerName, "Attacking_BeforeDoing||" + atcData);
        System.out.println("-. Sent Attacking BeforeDoing Message to UI");

        if (atcData.contains("shoot")) {
            atcData = atcData.replace("shoot", "shoot" + (gp.courtLeft ? "Right" : "Left"));
        }

        System.out.println("-. Sending Attacking data to Opponent");
        return atcData;
    }

    private String executeDefenceASP(String playerName, String AttackerData) {
        GamePlayer gp = GamePlayersManager.Instance().getData(playerName);

        System.out.println("-. Waiting for opponent data");
        String oppData = AttackerData;
        System.out.println("-. Received opponent data: " + oppData);

        System.out.println("data before def before update opp - " + gp.players.toString());

        updateOppPlayerData(playerName, oppData);

        System.out.println("data before def updated opp - " + gp.players.toString());

        //Run Asp for defence
        System.out.println("-. Running ASP as a defender");
        String defData = ASPExecutor.Instance().executeDefence(gp.players, timepoint, gp.tactic, gp.courtLeft, playerName, playerName.equals(player1name));
        System.out.println("-.ASP results as a defender: " + defData);

        updatePlayerOwnData(playerName, defData);

        System.out.println("data after def after update opp - " + gp.players.toString());

        String message2send = oppData + defData;

        //send what will do to UI
        System.out.println("-. Sending Defending BeforeDoing Message to UI");
        Client.sendMessage(playerName, "Defending_BeforeDoing||" + message2send);
        System.out.println("-. Sent Defending BeforeDoing Message to UI");

        return message2send;
    }

    private boolean areOnlyMoves(String result) {
        return !result.contains("pass") && !result.contains("shoot");
    }

    private String runSportCaster(String data) {
        try {
            //Send to sportsCaster
            System.out.println("-. Sending game data to SportsCaster");
            String send2 = updateNames(data);
            String result = SportsCaster.Instance().callCaster(send2, timepoint);
            result = revertNames(result);
            System.out.println("-. Received game results from SportsCaster " + result);
            return result;
        } catch (Exception e) {
            //terminate thread
            return null;
        }
    }

    private void updatePlayerOwnData(String playerName, String data) {
        String[] pData = data.split(">");
        GamePlayer gp = GamePlayersManager.Instance().getData(playerName);

        boolean isPlayer1 = playerName.equals(player1name);

        //UPDATED
        for (String pData1 : pData) {

            if (isPlayer1) {
                if (pData1.contains(TeamData.myPlayer1 + ",")) {
                    gp.players.p11X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p11Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.myPlayer2 + ",")) {
                    gp.players.p12X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p12Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.myPlayer3 + ",")) {
                    gp.players.p13X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p13Y = Integer.parseInt(pData1.split(",")[2]);
                }
            } else {
                if (pData1.contains(TeamData.oppPlayer1 + ",")) {
                    gp.players.p21X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p21Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.oppPlayer2 + ",")) {
                    gp.players.p22X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p22Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.oppPlayer3 + ",")) {
                    gp.players.p23X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p23Y = Integer.parseInt(pData1.split(",")[2]);
                }
            }

//            if (pData1.contains((isPlayer1 ? TeamData.myPlayer1 : TeamData.oppPlayer1) + ",")) {
//                gp.players.p11X = Integer.parseInt(pData1.split(",")[1]);
//                gp.players.p11Y = Integer.parseInt(pData1.split(",")[2]);
//            } else if (pData1.contains((isPlayer1 ? TeamData.myPlayer2 : TeamData.oppPlayer2) + ",")) {
//                gp.players.p12X = Integer.parseInt(pData1.split(",")[1]);
//                gp.players.p12Y = Integer.parseInt(pData1.split(",")[2]);
//            } else if (pData1.contains((isPlayer1 ? TeamData.myPlayer3 : TeamData.oppPlayer3) + ",")) {
//                gp.players.p13X = Integer.parseInt(pData1.split(",")[1]);
//                gp.players.p13Y = Integer.parseInt(pData1.split(",")[2]);
//            }
        }
    }

    private int calculateScore(int x, int y, boolean shootLeft) {
        if (shootLeft) {
            if (x >= 2 && x <= 4 && y <= 2) {
                return 2;
            }
            return 3;
        }

        if (x >= 2 && x <= 4 && y >= 6) {
            return 2;
        }
        return 3;
    }

    private void updateBallHolder(String data) {
        GamePlayer gp1 = GamePlayersManager.Instance().getData(player1name);
        GamePlayer gp2 = GamePlayersManager.Instance().getData(player2name);

        if (data.contains("pass") && (data.contains("<good>") || data.contains("<nogood>"))) {
            String[] bh;
            if (data.contains("<good>")) {
                bh = data.split("<good>");
            } else {
                bh = data.split("<nogood>");
            }
            String ballHolderName = bh[1].replace("<", "").replace(">", "");

            if (ballHolderName.equals(TeamData.myPlayer1) || ballHolderName.equals(TeamData.oppPlayer1)) {
                gp1.players.playerWithBall = 1;
                gp2.players.playerWithBall = 1;
            } else if (ballHolderName.equals(TeamData.myPlayer2) || ballHolderName.equals(TeamData.oppPlayer2)) {
                gp1.players.playerWithBall = 2;
                gp2.players.playerWithBall = 2;
            } else if (ballHolderName.equals(TeamData.myPlayer3) || ballHolderName.equals(TeamData.oppPlayer3)) {
                gp1.players.playerWithBall = 3;
                gp2.players.playerWithBall = 3;
            } else {
                System.out.println("ERROR: Playername unknown -- " + ballHolderName);
            }
        }

    }

    private void updateOppPlayerData(String playerName, String data) {
        String[] pData = data.split(">");
        GamePlayer gp = GamePlayersManager.Instance().getData(playerName);

        boolean isPlayer1 = playerName.equals(player1name);

        for (String pData1 : pData) {

            if (isPlayer1) {
                if (pData1.contains((TeamData.oppPlayer1) + ",")) {
                    gp.players.p21X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p21Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.oppPlayer2 + ",")) {
                    gp.players.p22X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p22Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.oppPlayer3 + ",")) {
                    gp.players.p23X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p23Y = Integer.parseInt(pData1.split(",")[2]);
                }
            } else {
                if (pData1.contains(TeamData.myPlayer1 + ",")) {
                    gp.players.p11X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p11Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.myPlayer2 + ",")) {
                    gp.players.p12X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p12Y = Integer.parseInt(pData1.split(",")[2]);
                } else if (pData1.contains(TeamData.myPlayer3 + ",")) {
                    gp.players.p13X = Integer.parseInt(pData1.split(",")[1]);
                    gp.players.p13Y = Integer.parseInt(pData1.split(",")[2]);
                }
            }

//            if (pData1.contains((!isPlayer1 ? TeamData.oppPlayer1 : TeamData.myPlayer1) + ",")) {
//                gp.players.p21X = Integer.parseInt(pData1.split(",")[1]);
//                gp.players.p21Y = Integer.parseInt(pData1.split(",")[2]);
//            } else if (pData1.contains((!isPlayer1 ? TeamData.oppPlayer2 : TeamData.myPlayer2) + ",")) {
//                gp.players.p22X = Integer.parseInt(pData1.split(",")[1]);
//                gp.players.p22Y = Integer.parseInt(pData1.split(",")[2]);
//            } else if (pData1.contains((!isPlayer1 ? TeamData.oppPlayer3 : TeamData.myPlayer3) + ",")) {
//                gp.players.p23X = Integer.parseInt(pData1.split(",")[1]);
//                gp.players.p23Y = Integer.parseInt(pData1.split(",")[2]);
//            }
        }
    }

    private String updateNames(String data) {
        data = data.replace(TeamData.myPlayer1, "911");
        data = data.replace(TeamData.myPlayer2, "912");
        data = data.replace(TeamData.myPlayer3, "913");

        data = data.replace(TeamData.oppPlayer1, "921");
        data = data.replace(TeamData.oppPlayer2, "922");
        data = data.replace(TeamData.oppPlayer3, "923");

        return data;
    }

    private String revertNames(String data) {
        data = data.replace("911", TeamData.myPlayer1);
        data = data.replace("912", TeamData.myPlayer2);
        data = data.replace("913", TeamData.myPlayer3);

        data = data.replace("921", TeamData.oppPlayer1);
        data = data.replace("922", TeamData.oppPlayer2);
        data = data.replace("923", TeamData.oppPlayer3);

        return data;
    }

}
