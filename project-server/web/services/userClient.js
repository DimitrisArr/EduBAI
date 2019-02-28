
var UserManager = (() => {

    /******************************************************************/

    const IP = '139.91.183.97';
    const PORT = 4566;

    const lsID = "loggedInUsername";

    /******************************************************************/

    class User {

        /***********************************/

        constructor() {
            this.prefix = `http://${IP}:${PORT}`;
        }

        /***********************************/

        //!@#
        getUsers() {
            return new Promise((resolve, reject) => {
                $.get(this.prefix + '/getUsers', (data) => {
                    resolve(data);
                }).fail((error) => reject(error));;
            });
        }

        /***********************************/

        //!@#
        registerUser(username, password, email) {
            return new Promise((resolve, reject) => {

                var data2Send = {
                    username: username,
                    password: password,
                    email: email
                };

                $.post(this.prefix + '/newUser', data2Send, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));

            });
        }

        /***********************************/

        //!@#
        isUserRegistered(username) {
            return new Promise((resolve, reject) => {

                var data2Send = {
                    username: username
                };

                $.get(this.prefix + '/validateUser', data2Send, (data) => {
                    resolve(data);
                }).fail((error) => reject(error));;

            });
        }

        /***********************************/

        //!@#
        login(username, password) {
            return new Promise((resolve, reject) => {

                var data2Send = {
                    username: username,
                    password: password
                };

                $.post(this.prefix + '/login', data2Send, (data) => {
                    localStorage.setItem(lsID, username);
                    resolve(data);
                }).fail((error) => reject(error));

            });
        }

        /***********************************/

        //!@#
        logout() {
            localStorage.removeItem(lsID);
        }


        /***********************************/
        //!@#
        isLoggedIn() {
            var user = localStorage.getItem(lsID);
            return !!user;
        }


    }

    /******************************************************************/

    return new User();

})();

/******************************************************************/

function checkLoggedIn() {
    if (localStorage.getItem(lsID)) {
        //!@#
        //is loggedin
    } else {
        //!@#
        //- not logged in
    }
}