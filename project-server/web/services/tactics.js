var TacticsManager = (() => {

    /******************************************************************/

    const IP = '139.91.183.97';
    const PORT = 4562;

    /******************************************************************/

    class Tactics {

        /***********************************/

        constructor() {
            this.prefix = `http://${IP}:${PORT}`;
        }

        /***********************************/

        getTactics(username) {
            return new Promise((resolve, reject) => {
                $.get(this.prefix + '/getTactics?username=' + username, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));
            });
        }

        /***********************************/

        /**
         * 
         * @param {string} username 
         * @param {string} tacticName 
         * @param {string} type attack / defence 
         */
        getTacticData(username, tacticName, type) {
            return new Promise((resolve, reject) => {
                $.get(this.prefix + `/getTacticData?username=${username}&tactic=${tacticName}&type=${type}`, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));
            });
        }

        /***********************************/

        /**
         * 
         * @param {string} username 
         * @param {string} tacticName 
         * @param {string} type attack / defence 
         */
        getPredefTactic( tacticName, type) {
            return new Promise((resolve, reject) => {
                $.get(this.prefix + `/getPredTacticData?tactic=${tacticName}&type=${type}`, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));
            });
        }

        /***********************************/

        /**
         * 
         * @param {string} username 
         * @param {string} tacticName 
         * @param {string} type attack - defence 
         */
        deleteTactic(username, tacticName, type) {
            return new Promise((resolve, reject) => {

                var data2Send = {
                    username: username,
                    tactic: tacticName,
                    type: type
                };

                $.post(this.prefix + '/deleteTactic', data2Send, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));

            });
        }

        /***********************************/

        uploadAttack(username, tacticName, fileElementID) {
            return new Promise((resolve, reject) => {
                var fd = new FormData();
                fd.append('file', document.getElementById(fileElementID).files[0]);
                fd.append("name", tacticName);
                fd.append("username", username);

                $.ajax({
                    url: `${this.prefix}/newAttackTactic`,
                    data: fd,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        resolve(data);
                    },
                    fail: function (data) {
                        reject(data);
                    }
                });
            });
        }

        /***********************************/

        uploadDefence(username, tacticName, fileElementID) {
            return new Promise((resolve, reject) => {
                var fd = new FormData();
                fd.append('file', document.getElementById(fileElementID).files[0]);
                fd.append("name", tacticName);
                fd.append("username", username);

                $.ajax({
                    url: `${this.prefix}/newDefenceTactic`,
                    data: fd,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        resolve(data);
                    },
                    fail: function (data) {
                        reject(data);
                    }
                });
            });
        }

        /***********************************/

        makeTextPretty(code) {
            return new Promise((resolve, reject) => {

                var data2Send = {
                    code: code,
                    lexer: 'prolog',
                };

                $.post('http://hilite.me/api', data2Send, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));

            });
        }

    }

    /******************************************************************/

    return new Tactics();

})();

$(document).ready(() => {
    $("#submit").click(() => {
        console.log("test");
        TacticsManager.uploadAttack();
    });
});

