/******************************************************************/

const express = require('express');;
const bodyParser = require('body-parser');
var routes = require('../users/users.routes');
var cors = require('cors');
var config = require('../config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/******************************************************************/

class MyServer {

    /***********************************/

    constructor() {
        this.port = config.serverPort;
        routes.setRoutes(app);
    }

    /***********************************/

    start() {
        app.listen(this.port, () => {
            console.log(`User Server Express Started at port: ${this.port}`);
        });
    }


    /***********************************/


}

/******************************************************************/

module.exports = new MyServer();

/******************************************************************/