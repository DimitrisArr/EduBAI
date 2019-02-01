/******************************************************************/

const express = require('express');;
const bodyParser = require('body-parser');
var routes = require('../status/status.routes');
var cors = require('cors');
var config = require('../config/config');
var logger = require('../logger/logger');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/******************************************************************/

class MyServer {

    /***********************************/

    constructor() {
        this.port = config.expressPort;
        routes.setRoutes(app);
    }

    /***********************************/

    start() {
        app.listen(this.port, () => {
            logger.log(`User Status Server Express Started at port: ${this.port}`);
        });
    }

    /***********************************/

}

/******************************************************************/

module.exports = new MyServer();

/******************************************************************/