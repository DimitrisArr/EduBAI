package GameData;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author aramp
 */
public class TeamData {

    public static String myPlayer1 = "ddd";
    public static String myPlayer2 = "eee";
    public static String myPlayer3 = "fff";

    public static String oppPlayer1 = "aaa";
    public static String oppPlayer2 = "bbb";
    public static String oppPlayer3 = "ccc";


    public static boolean isInTeam1(String playerName) {
        return playerName.contains(myPlayer1) || playerName.contains(myPlayer2) || playerName.contains(myPlayer3);
    }

}
