/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Communication;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 *
 * @author aramp
 */
public class SportsCaster {

    private Socket socket = null;
    private BufferedOutputStream bos;
    private DataOutputStream serverSend = null;
    private BufferedInputStream bis;
    private DataInputStream serverReceive = null;

    private InetAddress serverIp;

    private static SportsCaster _instance = null;

    private SportsCaster(String IP, int port) {
        try {

            serverIp = InetAddress.getByName(IP);
            socket = new Socket(serverIp, port);
            bos = new BufferedOutputStream(socket.getOutputStream());
            serverSend = new DataOutputStream(bos);
            bis = new BufferedInputStream(socket.getInputStream());
            serverReceive = new DataInputStream(bis);

        } catch (IOException e) {
            System.out.println("ERROR:" + e.toString());
            System.out.println("Terminating program.");
            System.exit(1);
        }
    }

    public static SportsCaster Instance() throws Exception {
        if (_instance == null) {
            _instance = new SportsCaster(InetAddress.getLocalHost().getHostAddress(), 5432);
        }
        return _instance;
    }

    public String callCaster(String OutgoingMessage, int timepoint) {
        String answer = new String();

        try {
            // TP: You can send as many messages as needed, before closing the connection with the server
            //OutgoingMessage = messageExample(); // The example is just for your reference to understand the message format
            serverSend.writeUTF(OutgoingMessage);
            serverSend.flush();

            answer = serverReceive.readUTF();
            System.out.println(timepoint + ": Server replied: " + answer);

        } catch (IOException ex) {
            System.out.println("ERROR:" + ex.toString());
        }
        return answer;
    }

    public void closeConnection() {

        try {

            //Close all connections  
            // TP: Whenever you wish, you can close the connection with the server with the following message
            // TP: No further messages will be processed by the server through this socket
            serverSend.writeUTF("Over");
            serverSend.flush();

            // TP: ONLY IF NEEDED, you can shut down the server remotely
            //serverSend.writeUTF("OverAndOut");
            //serverSend.flush();
            bis.close();
            serverReceive.close();
            serverSend.close();
            bos.close();
            socket.close();

        } catch (IOException ex) {
            System.out.println("ERROR:" + ex.toString());
        }

    }

}
