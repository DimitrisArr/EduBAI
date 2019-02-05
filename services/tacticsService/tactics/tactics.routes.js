
/******************************************************************/

var controller = require('./tactics.controller');
const multer = require('multer');

// SET STORAGE
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

/******************************************************************/

module.exports.setRoutes = (app) => {

    app.post('/newAttackTactic', controller.newAttackTactic);
    app.post('/newDefenceTactic', upload.single('file'), controller.newDefenciveTactic);
    app.post('/deleteTactic', controller.deleteTactic);

    app.get('/getTactics', controller.getTactics);
    app.get('/getTacticData', controller.getTacticData);

    app.get('/getDefenceTactics', controller.getDefenceTactics);
    app.get('/getAttackTactics', controller.getAttackTactics);

}

/******************************************************************/