/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package GameManager;

import HelperBeans.PlayersData;

/**
 *
 * @author aramp
 */
public class GamePlayer {

    public boolean courtLeft;
    public boolean attacker;
    public PlayersData players;
    public String tactic;

    private boolean newRoundDataSet = false;

    public void setData(boolean courtLeft, boolean attacker, PlayersData players, String tactic) {
        this.courtLeft = courtLeft;
        this.attacker = attacker;
        this.players = players;
        this.tactic = tactic;

        newRoundDataSet = true;
    }

    public void setData(boolean attacker, PlayersData players, String tactic) {
        this.attacker = attacker;
        this.players = players;
        this.tactic = tactic;

        newRoundDataSet = true;
    }

    public boolean getIfDataIsSetAndUpdate() {
        boolean tempRDS = newRoundDataSet;
        newRoundDataSet = false;
        return tempRDS;
    }

    public GamePlayer() {
    }

    public GamePlayer(boolean courtLeft, boolean attacker, PlayersData players, String tactic) {
        setData(courtLeft, attacker, players, tactic);
    }

}
