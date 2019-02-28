
/******************************************************************/

class UserStatus {

    /*****************************/

    constructor() {
        this.userStatusIP = "139.91.183.97";
        this.userStatusSocketPORT = 3458;
        this.userStatusAPIPORT = 8453;


        this.messageType = {
            USERS: "users",
            INVITE: "invite",
            ACCEPT: "accept",
            DECLINE: "decline",
            CANCEL: "cancel"
        };

        this.prefix = `http://${this.userStatusIP}:${this.userStatusAPIPORT}`

    }

    /*****************************/

    connect(username) {
        this.username = username;
        this.wsConnection = new WebSocket(`ws://${this.userStatusIP}:${this.userStatusSocketPORT}`, username);

        this.wsConnection.onmessage = (ev) => {
            //list of all users
            var data = JSON.parse(ev.data);

            switch (data.type) {
                //!@#
                case this.messageType.USERS:
                    //console.log("users:", data.message);
                    //list of all users
                    if(shouldDisplayOnlineUsers){
                        populateUsersDiv(data.message);
                    }

                    break;
                case this.messageType.INVITE:
                    console.log("invitation from: ", data.user);
                    this.userInvited = data.user;
                    receivedInvitation(data.user);
                    //invitation for game
                    break;
                case this.messageType.DECLINE:
                    console.log("rejection from: ", data.user);
                    invitationRejected(data.user);
                    //rejection for invitation
                    break;
                case this.messageType.ACCEPT:
                    console.log("acceptance from: ", data.user);
                    invitationAccepted(data.user);
                    //acceptance for invitation
                    break;
                case this.messageType.CANCEL:
                    console.log("cancel from: ", data.user);
                    invitationCancelled(data.user);
                    //acceptance for invitation
                    break;
            }
        };
    }

    /*****************************/

    //!@#
    invite(user) {
        this.userInvited = user;

        return new Promise((resolve, reject) => {

            var data2Send = {
                from: this.username,
                to: user
            };

            $.post(this.prefix + '/inviteOpponent', data2Send, (data) => {
                resolve(data);
            }).fail((error) => reject(error));

        });
    }


    /*****************************/

    //!@#
    accept() {

        var to = this.userInvited;
        this.userInvited = undefined;


        return new Promise((resolve, reject) => {

            var data2Send = {
                from: this.username,
                to: to
            };

            $.post(this.prefix + '/acceptInvitation', data2Send, (data) => {
                resolve(data);
            }).fail((error) => reject(error));

        });
    }

    /*****************************/

    //!@#
    cancel() {

        var to = this.userInvited;
        this.userInvited = undefined;


        return new Promise((resolve, reject) => {

            var data2Send = {
                from: this.username,
                to: to
            };

            $.post(this.prefix + '/cancelInvitation', data2Send, (data) => {
                resolve(data);
            }).fail((error) => reject(error));

        });
    }

    /*****************************/

    //!@#
    decline() {
        var to = this.userInvited;
        this.userInvited = undefined;

        return new Promise((resolve, reject) => {

            var data2Send = {
                from: this.username,
                to: to
            };

            $.post(this.prefix + '/declineInvitation', data2Send, (data) => {
                resolve(data);
            }).fail((error) => reject(error));

        });
    }

}

/******************************************************************/

var userStatus = new UserStatus();