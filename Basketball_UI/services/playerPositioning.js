

class PlayerPositioning {

    constructor() {
        this.ip = "139.91.96.174";
        this.port = 7756;
    }

    connect(username) {
        this.username = username;
        this.wsConnection = new WebSocket(`ws://${this.userStatusIP}:${this.userStatusSocketPORT}`, username);

        this.wsConnection.onmessage = (ev) => {
            //!@#
            //list of all users
            var data = JSON.parse(ev.data);
            console.log("received positioning: ", data);
        };

        this.wsConnection.onclose = (ev) => {
            console.log('connection with player positioning service closed: ' + ev.data);
        }

    }

    //!@#
    sendPosition(positions) {
        this.wsConnection.send(JSON.stringify(positions));
    }

}


var playerPositioning = new PlayerPositioning();