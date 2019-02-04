package Executor;

import GameData.FilePaths;
import GameData.TeamData;
import HelperBeans.PlayersData;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author aramp
 */
public class ASPExecutor {

    private String clingoPath = FilePaths.clingoPath;
    private String projectFile = "";

    private String decFile = FilePaths.baseFilesFolder + "dec.lp";
    private String gameEnvironment = FilePaths.baseFilesFolder + "game_environment.lp";
    private String gameUpdate = FilePaths.baseFilesFolder + "game_update.lp";

    private Map<String, String> defTactics;
    private Map<String, String> attTactics;
    private String tactic;

    private static ASPExecutor _instance = null;

    private ASPExecutor() {
        //
        attTactics = new HashMap<String, String>();

        attTactics.put("tactic1left", FilePaths.attcTacticsFolder + "go_right_and_shoot_.lp");
        attTactics.put("tactic2left", FilePaths.attcTacticsFolder + "pithanothtes_tactic_right.lp");
        attTactics.put("tactic3left", FilePaths.attcTacticsFolder + "all_go_right.lp");

        attTactics.put("tactic1right", FilePaths.attcTacticsFolder + "go_left_and_shoot_.lp");
        attTactics.put("tactic2right", FilePaths.attcTacticsFolder + "pithanothtes_tactic_left.lp");
        attTactics.put("tactic3right", FilePaths.attcTacticsFolder + "all_go_left.lp");

        defTactics = new HashMap<String, String>();

        defTactics.put("tactic1", FilePaths.defTacticsFolder + "tactic_defensive_1.lp");
        defTactics.put("tactic2", FilePaths.defTacticsFolder + "tactic_defensive_2.lp");
        defTactics.put("tactic3", FilePaths.defTacticsFolder + "tactic_defensive_3.lp");

    }

    public static ASPExecutor Instance() {
        if (_instance == null) {
            _instance = new ASPExecutor();
        }
        return _instance;
    }

    public String executeAttack(PlayersData data, int timepoint, String tactic, boolean leftCourt, String playerName, boolean isPlayer1) {
        try {

            this.tactic = tactic;

            projectFile = attTactics.get(tactic + (leftCourt ? "left" : "right"));

            String[] params = getAttackASPParameters(data, timepoint, isPlayer1);

            String[] command = {clingoPath + "clingo", projectFile, decFile};

            String[] result = Stream.concat(Arrays.stream(command), Arrays.stream(params)).toArray(String[]::new);

            Process p = Runtime.getRuntime().exec(result);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(p.getInputStream()));

            String fullLine = "";
            String line;
            while ((line = in.readLine()) != null) {
                fullLine += line + " ";
            }

            in.close();

            return parseAttcData(fullLine, playerName, isPlayer1);

        } catch (IOException e) {
            System.err.println("Error while trying to run clingo: " + e.getMessage());
            return null;
        }
    }

    public String executeDefence(PlayersData data, int timepoint, String tactic, boolean leftCourt, String playerName, boolean isPlayer1) {
        try {
            this.tactic = tactic;

            projectFile = defTactics.get(tactic);

            String[] params = getDefenceASPParameters(data, timepoint, leftCourt, isPlayer1);

            String[] command = {clingoPath + "clingo", projectFile, gameEnvironment, gameUpdate, decFile};

            String[] result = Stream.concat(Arrays.stream(command), Arrays.stream(params)).toArray(String[]::new);

            Process p = Runtime.getRuntime().exec(result);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(p.getInputStream()));

            String fullLine = "";
            String line;
            while ((line = in.readLine()) != null) {
                fullLine += line + " ";
            }

            in.close();

            return parseDefData(fullLine, playerName, isPlayer1);

        } catch (IOException e) {
            System.err.println("Error while trying to run clingo: " + e.getMessage());
            return null;
        }
    }

    public String parseAttcData(String data, String playerName, boolean isPlayer1) {

        String data2Send;
        data2Send = "<" + playerName + ">";

        String HappensPattern = "happens[^ ]*";
        String HoldsAtPattern = "holdsAt[^ ]*1\\) ";

        Pattern pattern = Pattern.compile(HappensPattern);
        Matcher matcher = pattern.matcher(data);

        String value;
        boolean isPass = false;
        boolean isShoot = false;
        String player1 = "", player2 = "";
        while (matcher.find()) {
            value = matcher.group();

            if (value.contains("move")) {
                continue;
            }

            if (value.contains("shoot")) {

                String[] sep = value.split(",");

                player1 = sep[0].replace("happens(shoot(", "");
                player1 = player1.replace(")", "");
                isShoot = true;
                data2Send += "<shoot>";

                break;
            }

            if (value.contains("pass")) {

                String[] sep = value.split(",");

                player1 = sep[0].replace("happens(pass(", "");
                player2 = sep[1].replace(")", "");

                isPass = true;

                data2Send += "<pass>";

                break;
            }
        }

        pattern = Pattern.compile(HoldsAtPattern);
        matcher = pattern.matcher(data);
        String[] playersPos = new String[3];
        int found = 0;
        while (matcher.find()) {
            value = matcher.group();

            if (value.contains("holdsAt(position_player(" + (isPlayer1 ? TeamData.myPlayer1 : TeamData.oppPlayer1))
                    || value.contains("holdsAt(position_player(" + (isPlayer1 ? TeamData.myPlayer2 : TeamData.oppPlayer2))
                    || value.contains("holdsAt(position_player(" + (isPlayer1 ? TeamData.myPlayer3 : TeamData.oppPlayer3))) {

                String[] sep = value.split(",");

                sep[0] = sep[0].replace("holdsAt(position_player(", "<");

                playersPos[found++] = sep[0] + "," + sep[1] + "," + sep[2].replace(")", ">");
            }
        }

        if (isPass || isShoot) {
            for (int i = 0; i < playersPos.length; i++) {
                if (playersPos[i].contains(player1)) {
                    if (i != 0) {
                        String x = playersPos[0];
                        playersPos[0] = playersPos[i];
                        playersPos[i] = x;
                    }
                    break;
                }
            }
        }

        if (isPass) {
            for (int i = 0; i < playersPos.length; i++) {
                if (playersPos[i].contains(player2)) {
                    if (i != 1) {
                        String x = playersPos[1];
                        playersPos[1] = playersPos[i];
                        playersPos[i] = x;
                    }
                    break;
                }
            }
        }

        for (String playersPo : playersPos) {
            data2Send += playersPo;
        }

        return data2Send;
    }

    public String parseDefData(String data, String playerName, boolean isPlayer1) {

        String data2Send;
        data2Send = "<" + playerName + ">";

        String HoldsAtPattern = "holdsAt[^ ]*\\),1\\) ";

        String value;
        Pattern pattern = Pattern.compile(HoldsAtPattern);
        Matcher matcher = pattern.matcher(data);
        String[] playersPos = new String[3];
        int found = 0;
        while (matcher.find()) {
            value = matcher.group();

            if (value.contains("holdsAt(player_pos(" + (isPlayer1 ? TeamData.myPlayer1 : TeamData.oppPlayer1))
                    || value.contains("holdsAt(player_pos(" + (isPlayer1 ? TeamData.myPlayer2 : TeamData.oppPlayer2))
                    || value.contains("holdsAt(player_pos(" + (isPlayer1 ? TeamData.myPlayer3 : TeamData.oppPlayer3))) {

                value = value.replace("holdsAt(player_pos(", "");
                String[] sep = value.split("\\(");

                String[] sep2 = sep[1].split(",");

                playersPos[found++] = "<" + sep[0] + sep2[0].replace("(", "") + "," + sep2[1].replace("))", "") + ">";
            }
        }

        for (String playersPo : playersPos) {
            data2Send += playersPo;
        }

        return data2Send;
    }

    public String[] getAttackASPParameters(PlayersData data, int timepoint, boolean isPlayer1) {
        ArrayList<String> parameters = new ArrayList();

        parameters.add("-c maxstep=1");

        parameters.add("-c tmpt=" + timepoint);

        parameters.add("-c p1x=" + data.p11X);
        parameters.add("-c p1y=" + data.p11Y);

        parameters.add("-c p2x=" + data.p12X);
        parameters.add("-c p2y=" + data.p12Y);

        parameters.add("-c p3x=" + data.p13X);
        parameters.add("-c p3y=" + data.p13Y);

        parameters.add("-c op1x=" + data.p21X);
        parameters.add("-c op1y=" + data.p21Y);

        parameters.add("-c op2x=" + data.p22X);
        parameters.add("-c op2y=" + data.p22Y);

        parameters.add("-c op3x=" + data.p23X);
        parameters.add("-c op3y=" + data.p23Y);

        parameters.add("-c myp1=" + (isPlayer1 ? TeamData.myPlayer1 : TeamData.oppPlayer1));
        parameters.add("-c myp2=" + (isPlayer1 ? TeamData.myPlayer2 : TeamData.oppPlayer2));
        parameters.add("-c myp3=" + (isPlayer1 ? TeamData.myPlayer3 : TeamData.oppPlayer3));

        parameters.add("-c opp1=" + (isPlayer1 ? TeamData.oppPlayer1 : TeamData.myPlayer1));
        parameters.add("-c opp2=" + (isPlayer1 ? TeamData.oppPlayer2 : TeamData.myPlayer2));
        parameters.add("-c opp3=" + (isPlayer1 ? TeamData.oppPlayer3 : TeamData.myPlayer3));

        String playerWithBall;
        switch (data.playerWithBall) {
            case 1:
                playerWithBall = (isPlayer1 ? TeamData.myPlayer1 : TeamData.oppPlayer1);
                break;
            case 2:
                playerWithBall = (isPlayer1 ? TeamData.myPlayer2 : TeamData.oppPlayer2);
                break;
            case 3:
            default:
                playerWithBall = (isPlayer1 ? TeamData.myPlayer3 : TeamData.oppPlayer3);
                break;

        }
        parameters.add("-c playerwball=" + playerWithBall);

        return parameters.toArray(new String[parameters.size()]);
    }

    public String[] getDefenceASPParameters(PlayersData data, int timepoint, boolean leftCourt, boolean isPlayer1) {
        ArrayList<String> parameters = new ArrayList();

        parameters.add("-c maxstep=1");

        parameters.add("-c tmpt=" + timepoint);

        parameters.add("-c myp1=" + (isPlayer1 ? TeamData.myPlayer1 : TeamData.oppPlayer1));
        parameters.add("-c myp2=" + (isPlayer1 ? TeamData.myPlayer2 : TeamData.oppPlayer2));
        parameters.add("-c myp3=" + (isPlayer1 ? TeamData.myPlayer3 : TeamData.oppPlayer3));

        parameters.add("-c opp1=" + (isPlayer1 ? TeamData.oppPlayer1 : TeamData.myPlayer1));
        parameters.add("-c opp2=" + (isPlayer1 ? TeamData.oppPlayer2 : TeamData.myPlayer2));
        parameters.add("-c opp3=" + (isPlayer1 ? TeamData.oppPlayer3 : TeamData.myPlayer3));

        parameters.add("-c tm_B_p1_pos=(" + data.p11X + "," + data.p11Y + ")");
        parameters.add("-c tm_B_p2_pos=(" + data.p12X + "," + data.p12Y + ")");
        parameters.add("-c tm_B_p3_pos=(" + data.p13X + "," + data.p13Y + ")");

        parameters.add("-c tm_A_p1_pos=(" + data.p21X + "," + data.p21Y + ")");
        parameters.add("-c tm_A_p2_pos=(" + data.p22X + "," + data.p22Y + ")");
        parameters.add("-c tm_A_p3_pos=(" + data.p23X + "," + data.p23Y + ")");

        if (leftCourt) {
            parameters.add("-c tm_A_side=right");
            parameters.add("-c tm_B_side=left");
        } else {
            parameters.add("-c tm_B_side=right");
            parameters.add("-c tm_A_side=left");
        }

        String playerWithBall;
        switch (data.playerWithBall) {
            case 1:
                playerWithBall = (isPlayer1 ? TeamData.oppPlayer1 : TeamData.myPlayer1);
                break;
            case 2:
                playerWithBall = (isPlayer1 ? TeamData.oppPlayer2 : TeamData.myPlayer2);
                break;
            case 3:
            default:
                playerWithBall = (isPlayer1 ? TeamData.oppPlayer3 : TeamData.myPlayer3);
                break;
        }

        parameters.add("-c p_BH=" + playerWithBall);

        return parameters.toArray(new String[parameters.size()]);
    }

}
