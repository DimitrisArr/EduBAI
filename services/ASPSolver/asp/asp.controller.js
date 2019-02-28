/******************************************************************/

var logger = require('../logger/logger');
var cp = require('child_process');

/******************************************************************/


function updateChar(data, index, char) {

    if (data.length == index + 1) {
        return data;
    }

    var pIndex = data.indexOf(char, index + 1);

    if (pIndex < 0) {
        return data;
    }

    data = data.substring(0, pIndex) + '\\' + data.substring(pIndex);

    return updateChar(data, pIndex + 2, char);

}

/******************************************************************/

module.exports.run = async (req, res) => {

    var command = undefined;

    try {
        //--

        console.log('body: ', req.body);

        var k = Object.keys(req.body);
        k = k[0] + "=" + req.body[k[0]];

        k = k.replace('{"command": "', '');
        k = k.replace('"}', '');
        k = updateChar(k, 0, ')');
        k = updateChar(k, 0, '(');;
        command = k;
        console.log('command: ', command);
    } catch (e) {
        res.status(400).send('parameter(s) missing');
        return;
    }

    if (!command) {
        res.status(400).send('parameter(s) missing');
        return;
    }


    try {
        logger.log('trying to execute command: ' + command);
        cp.exec(command, (e, out, err) => {
            logger.log('command -' + command + ' executed');
            console.log("err", e);
            console.log("out", out);
            console.log("out err", err);
            out = out.replace('SATISFIABLE', ' ');
            res.send(out);
        });

    } catch (e) {
        res.status(500).send(e);
    }

}

/******************************************************************/
