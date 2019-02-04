/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package GameManager;

/**
 *
 * @author aramp
 */
public class GameThread extends Thread {

    private String player1Name;
    private String player2Name;

    private GameMaster gm;

    @Override
    public void run() {
        System.out.println("HHHHHH");
        gm = new GameMaster(player1Name, player2Name);
        gm.playOfficialMatchNew();
    }

    public void setPlayerNames(String player1Name, String player2Name) {
        this.player1Name = player1Name;
        this.player2Name = player2Name;
    }

}
