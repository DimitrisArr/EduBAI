/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package GameManager;

import HelperBeans.PlayersData;
import java.util.ArrayList;

class GameTeams {

    public String player1name;
    public String player2name;
    public GamePlayer player1data;
    public GamePlayer player2data;
    public int teamID;

    public GameTeams() {
        player1name = null;
        player2name = null;
    }

    public boolean isReady() {
        return player1name != null && player2name != null;
    }
}

/**
 *
 * @author aramp
 */
public class GamePlayersManager {

    private static int teamID = 1;

    private ArrayList<GameTeams> games;

    private static GamePlayersManager _instance = null;

    private GamePlayersManager() {
        games = new ArrayList<>();
    }

    public static GamePlayersManager Instance() {
        if (_instance == null) {
            _instance = new GamePlayersManager();
        }
        return _instance;
    }

    /**
     *
     * @return 0 if not ready to start, otherwise a positive integer identifier
     * for the game
     */
    public int setStartData(String myplayer, String opponent, PlayersData players, boolean courtLeft, String tactic, boolean attacker) {

        for (GameTeams game : games) {
            if (!game.isReady() && game.player1name.equals(opponent)) {
                game.player2name = myplayer;
                game.player2data = new GamePlayer(courtLeft, attacker, players, tactic);
                return game.teamID;
            }
        }

        GameTeams game = new GameTeams();
        game.player1name = myplayer;
        game.player1data = new GamePlayer(courtLeft, attacker, players, tactic);
        game.teamID = GamePlayersManager.teamID++;

        games.add(game);

        return 0;
    }

    public boolean setRoundData(String myplayer, PlayersData players, String tactic, boolean attacker) {
        for (GameTeams game : games) {

            if (!game.isReady()) {
                continue;
            }

            GamePlayer playerDataFound = null;

            if (game.player1name.equals(myplayer)) {
                playerDataFound = game.player1data;
            } else if (game.player2name.equals(myplayer)) {
                playerDataFound = game.player2data;
            }

            if (playerDataFound != null) {
                playerDataFound.setData(attacker, players, tactic);
                return true;
            }

        }
        return false;
    }

    public GamePlayer getData(String playerName) {
        for (GameTeams game : games) {
            if (playerName.equals(game.player1name)) {
                return game.player1data;
            }

            if (playerName.equals(game.player2name)) {
                return game.player2data;
            }
        }
        return null;
    }

    public int removeGame(String playerName) {
        int indexFound = -1;
        for (int i = 0; i < games.size(); i++) {
            GameTeams game = games.get(i);
            if (playerName.equals(game.player1name) || playerName.equals(game.player2name)) {
                games.remove(i);
                return game.teamID;
            }
        }
        return 0;
    }

    public String getOpponent(String playerName) {
        for (GameTeams game : games) {
            if (!game.isReady()) {
                continue;
            }

            if (game.player1name.equals(playerName)) {
                return game.player2name;
            }

            if (game.player2name.equals(playerName)) {
                return game.player1name;
            }
        }
        return null;
    }

    public int getTeamID(String playerName) {
        for (GameTeams game : games) {
            if (game.player1name.equals(playerName) || game.player2name.equals(playerName)) {
                return game.teamID;
            }
        }
        return 0;
    }
}
