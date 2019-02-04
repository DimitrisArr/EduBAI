/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Communication;

import GameData.TeamData;
import HelperBeans.MessageBean;
import GameManager.GamePlayersManager;
import GameManager.GameThread;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author aramp
 */
@ServerEndpoint("/client")
public class Client {

    private static HashMap<Integer, GameThread> gameTheads = new HashMap<Integer, GameThread>();
    private static HashMap<String, Session> connections = new HashMap<String, Session>();

    public static void sendMessage(String playername, String message) {

        System.out.println("sending message from " + playername + " message:" + message);

        Session connection = connections.get(playername);

        try {
            connection.getBasicRemote().sendText(message);
        } catch (IOException e) {
            //
        }

        if (message.contains("END_GAME")) {
            //TODO: Update cause depricated
            int id = GamePlayersManager.Instance().removeGame(playername);
            if (id > 0) {
                GameThread gt = gameTheads.get(id);
                if (gt != null) {
                    gt.stop();
                    gameTheads.remove(id);
                }
            }
        }
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("open -- " + session.getQueryString());

        connections.put(session.getQueryString(), session);
        System.out.println("onOpen::" + session.getId());
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("close -- " + session.getQueryString());
        connections.remove(session.getQueryString());
        System.out.println("onClose::" + session.getId());

        int ID = GamePlayersManager.Instance().removeGame(session.getQueryString());
        String opponent = GamePlayersManager.Instance().getOpponent(session.getQueryString());

        if (ID > 0) {
            GameThread gt = gameTheads.get(ID);
            if (gt != null) {
                gt.stop();
                gameTheads.remove(ID);
            }
        }

        try {
            if (connections.get(opponent) != null) {
                connections.get(opponent).close();
            }
        } catch (Exception e) {
            //no problem
        }

    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("onMessage::From=" + session.getId() + " Message=" + message);

        MessageBean data = new Gson().fromJson(message, MessageBean.class);

        switch (data.type) {
            case "START": {

                int start = GamePlayersManager.Instance().setStartData(data.myname, data.opponent, data.players, data.leftCourt, data.tactic, data.attacker);

                System.out.println(start + " -- " + data.myname);

                if (start != 0) {

                    //send team names to clients
                    sendTeamNames(data.opponent, data.myname);

                    //start new thread for game
                    GameThread gt = new GameThread();
                    gt.setPlayerNames(data.opponent, data.myname);
                    gameTheads.put(start, gt);
                    gt.start();
                }
                break;
            }
            case "END": {
                break;
            }
            case "NEW_ROUND": {
                GamePlayersManager.Instance().setRoundData(data.myname, data.players, data.tactic, data.attacker);
                break;
            }
            default: {

            }
        }

    }

    @OnError
    public void onError(Throwable t) {
        System.out.println("onError::" + t.getMessage());
    }

    private void sendTeamNames(String team1Name, String team2Name) {
        String MessageASend = "";
        MessageASend = TeamData.myPlayer1 + "||";
        MessageASend += TeamData.myPlayer2 + "||";
        MessageASend += TeamData.myPlayer3;

        String MessageBSend = "";
        MessageBSend = TeamData.oppPlayer1 + "||";
        MessageBSend += TeamData.oppPlayer2 + "||";
        MessageBSend += TeamData.oppPlayer3;

        Client.sendMessage(team1Name, "PLAYER_NAMES||" + MessageASend + "||" + MessageBSend);
        Client.sendMessage(team2Name, "PLAYER_NAMES||" + MessageBSend + "||" + MessageASend);

    }
}
