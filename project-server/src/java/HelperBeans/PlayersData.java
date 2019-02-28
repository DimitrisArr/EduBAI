/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package HelperBeans;

/**
 *
 * @author aramp
 */
public class PlayersData {

    public int p11X;
    public int p11Y;

    public int p12X;
    public int p12Y;

    public int p13X;
    public int p13Y;

    public int p21X;
    public int p21Y;

    public int p22X;
    public int p22Y;

    public int p23X;
    public int p23Y;

    public int playerWithBall;

    @Override
    public String toString() {
        String data = "";
        data += "my player 1:  " + p11X + "," + p11Y;
        data += " my player 2:  " + p12X + "," + p12Y;
        data += " my player 3:  " + p13X + "," + p13Y;

        data += " opp player 1:  " + p21X + "," + p21Y;
        data += " opp player 2:  " + p22X + "," + p22Y;
        data += " opp player 3:  " + p23X + "," + p23Y;

        return data;
    }

}
