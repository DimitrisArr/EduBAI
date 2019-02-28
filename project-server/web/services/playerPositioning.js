

class PlayerPositioning {

    constructor() {
        this.ip = "139.91.183.97";
        this.port = 7756;
    }

    connect(username) {
        this.username = username;
        this.wsConnection = new WebSocket(`ws://${this.ip}:${this.port}`, username);

        this.wsConnection.onmessage = (ev) => {
            //!@#

            var data = JSON.parse(ev.data);
            updateOpponentCourtPositionAndBall(data.position, data.ballHolder);
            console.log("received positioning: ", data);
        };

        this.wsConnection.onclose = (ev) => {
            console.log('connection with player positioning service closed: ' + ev.data);
        }

    }

    //!@#
    sendData(position, ballHolder) {
        this.wsConnection.send(JSON.stringify({
            position: position,
            ballHolder: ballHolder
        }));
    }

    close() {
        this.wsConnection.close();
    }

}


var playerPositioning = new PlayerPositioning();

