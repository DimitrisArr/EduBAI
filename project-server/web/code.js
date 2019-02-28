

/*********************************************************************************************** */


/*********************************************************************************************** */
function onRegisterClick() {
    var registerModal = document.getElementById('registerModal');
    registerModal.style.display = "block";
}

function onLogInClick() {
    var loginModal = document.getElementById('loginModal');
    loginModal.style.display = "block";
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function onRegisterSubmit() {
    var username = document.getElementById('register_username_inputID').value;
    var password = document.getElementById('register_password_inputID').value;
    var email = document.getElementById('email_inputID').value;

    var problem = false;

    var tooltip = document.getElementById('tooltiptext');
    tooltip.style.display = 'none';
    document.getElementById('register_username_inputID').style.border = null;

    if (username == "") {
        document.getElementById('register_username_inputID').style.border = "solid red";

        tooltip.style.display = 'none';
        problem = true;
    }

    if (password == "") {
        document.getElementById('register_password_inputID').style.border = "solid red";
        problem = true;
    } else {
        document.getElementById('register_password_inputID').style.border = "solid green";
    }

    if (email == "") {
        document.getElementById('email_inputID').style.border = "solid red";
        problem = true;
    } else {
        if (!validateEmail(email)) {
            document.getElementById('email_inputID').style.border = "solid red";
            problem = true;
        } else {
            document.getElementById('email_inputID').style.border = "solid green";
        }
    }

    if (problem) {
        return;
    }

    UserManager.isUserRegistered(username).then(() => {
        //user already exists
        tooltip.style.display = 'inline-block';
        document.getElementById('register_username_inputID').style.border = "solid red";
        problem = true;

    }).catch(() => {
        document.getElementById('register_username_inputID').style.border = "solid green";

        tooltip.style.display = 'none';

        UserManager.registerUser(username, password, email).then(() => {
            var register_modal_div = document.getElementById('register_modal_div');
            register_modal_div.style.display = 'none';

            var registration_success = document.getElementById('registration_success');
            registration_success.style.display = 'block';
        }).catch(() => {
        });
    });

}

function onLogInSubmit() {

    var username = document.getElementById('login_username_inputID').value;
    var password = document.getElementById('login_password_inputID').value;

    UserManager.login(username, password).then(() => {
        //logged in
        var loginModal = document.getElementById('loginModal');
        loginModal.style.display = "none";
        localStorage.setItem('username', username);

        var tooltip = document.getElementById('tooltiptext_login');
        tooltip.style.display = 'none';

        window.location = "start_page.html";
    }).catch(() => {
        //not logged in - error username or password not correct
        var tooltip = document.getElementById('tooltiptext_login');
        tooltip.style.display = 'inline-block';
    });

}

function logOut() {
    UserManager.logout();
    resetLocalStorageVarsOnLogOut();
    window.location = "index.html"
}

function documentationClicked() {

    var docMenuText = document.getElementById("documentation_menu_text");
    docMenuText.style.fontWeight = "900";

    var tacticsMenuText = document.getElementById("tactics_menu_text");
    tacticsMenuText.style.fontWeight = "normal";

    var containerDiv = document.getElementById('main_display_div');

    var tactics_container = document.getElementById('tactics_container');
    tactics_container.style.display = "none";

    var documentation_container = document.getElementById('documentation_container');
    documentation_container.style.display = "block";

    var view_selected_tactic_div = document.getElementById('view_selected_tactic_div');
    if (view_selected_tactic_div) {
        view_selected_tactic_div.style.display = 'none';
    }

    //TODO: fill with correct documentation
}

function tacticsClicked() {

    var docMenuText = document.getElementById("documentation_menu_text");
    docMenuText.style.fontWeight = "normal";

    var tacticsMenuText = document.getElementById("tactics_menu_text");
    tacticsMenuText.style.fontWeight = "900";

    var tactics_container = document.getElementById('tactics_container');
    tactics_container.style.display = "flex";

    var documentation_container = document.getElementById('documentation_container');
    documentation_container.style.display = "none";

    var view_selected_tactic_div = document.getElementById('view_selected_tactic_div');
    if (view_selected_tactic_div) {
        view_selected_tactic_div.style.display = 'none';
    }

}


function addNewAttackingTactic() {
    var addAttackingTacticModal = document.getElementById('addAttackingTacticModal');
    addAttackingTacticModal.style.display = 'block';
}

function addNewDefendingTactic() {
    var addDefendingTacticModal = document.getElementById('addDefendingTacticModal');
    addDefendingTacticModal.style.display = 'block';
}

function calculateNewTacticKey(tacticsDict) { //get last key
    var lastKey = Object.keys(tacticsDict)[Object.keys(tacticsDict).length - 1];
    console.log(lastKey);
    if (!lastKey) { //first tactic to add
        return "tactic1";
    } else {
        var tacticNumStr = lastKey.replace("tactic", "");
        var tacticNum = parseInt(tacticNumStr);
        var newTacticNum = tacticNum + 1;
        var newTactic = "tactic" + newTacticNum;
        console.log(newTactic);
        return newTactic;
    }

}

function addTactic2UI(type, tacticName) {
    var newTacticDiv = document.createElement('div');
    newTacticDiv.setAttribute('class', 'tactics');
    var parent = document.getElementById('my_tactics_' + type + '_div');
    parent.insertBefore(newTacticDiv, null);

    newTacticDiv.innerHTML = '<p role="button" class="tactics_text" onclick="viewSelectedTactic(\'mine\',this, \'' + type + '\' )">' + tacticName + '</p>';
}

function deleteTacticFromUI(type, tacticName) {
    var tacticsDiv = document.getElementById("my_tactics_" + type + "_div");
    var what2delete;

    Array.from(tacticsDiv.children).forEach(tacticsChildDiv => {
        if (tacticsChildDiv.classList.contains("tactics")) {
            var tacticsText = tacticsChildDiv.children[0];
            if (tacticsText.innerText == tacticName) {
                what2delete = tacticsChildDiv;
            }
        }
    });

    tacticsDiv.removeChild(what2delete);
}

function uploadAttackingTactic() {
    var tacticName = document.getElementById('attacking_tactic_name_inputID').value;
    var addAttackingTacticModal = document.getElementById('addAttackingTacticModal');

    TacticsManager.uploadAttack(localStorage.getItem("username"), tacticName, 'attacking_choose_file_inputID')
        .then((data) => {
            addAttackingTacticModal.style.display = 'none';

            //add new tactic to UI
            addTactic2UI('attacking', tacticName);
        })
        .catch((error) => {
            console.log("error while uploading attack tactic");
        });


}

function uploadDefendingTactic() {
    var tacticName = document.getElementById('defending_tactic_name_inputID').value;
    var addDefendingTacticModal = document.getElementById('addDefendingTacticModal');

    TacticsManager.uploadDefence(localStorage.getItem("username"), tacticName, 'defending_choose_file_inputID')
        .then(data => {
            addDefendingTacticModal.style.display = 'none';

            //add new tactic to UI
            addTactic2UI('defending', tacticName);
        })
        .catch(err => {
            console.log("error while uploading defence tactic");
        });

}

function replaceTactic() {
    var replaceTacticModal = document.getElementById('replaceTacticModal');
    replaceTacticModal.style.display = 'block';
}

function getKeyByValue(object, value) {
    return (_.invert(object))[value];
}

function replaceTacticSubmit() {
    var replaceTacticModal = document.getElementById('replaceTacticModal');
    replaceTacticModal.style.display = 'none';

    //TODO: update name in UI
    var newTacticName = document.getElementById('replace_tactic_name_inputID').value;
    var oldTacticNameTmp = document.getElementById('selected_tactic_div_text_id').innerText;
    var oldTacticName = "";
    if (oldTacticNameTmp.includes("attacking")) {
        oldTacticName = oldTacticNameTmp.replace("My attacking tactic: ", "");
        document.getElementById('selected_tactic_div_text_id').innerText = "My attacking tactic: " + newTacticName;
        addTactic2UI('attacking', newTacticName);
        deleteTacticFromUI('attacking', oldTacticName);
    } else {
        oldTacticName = oldTacticNameTmp.replace("My defending tactic: ", "");
        document.getElementById('selected_tactic_div_text_id').innerText = "My defending tactic: " + newTacticName;
        addTactic2UI('defending', newTacticName);
        deleteTacticFromUI('defending', oldTacticName);
    }

    //TODO: replace tactic in backend

}

function validateTactic() {
    //TODO: validate tactic and display warning message if needed
}

function viewSelectedTactic(type, tactic, attackingOrDefending) {
    var tacticSelected = tactic.innerHTML;

    if (type == 'predefined') {
        typeOftactic = 'predefined';
    } else {
        typeOftactic = 'mine';
    }

    var tactics_container = document.getElementById('tactics_container');
    tactics_container.style.display = "none";

    var view_selected_tactic_div = document.getElementById('view_selected_tactic_div');
    view_selected_tactic_div.style.display = 'block';

    var selected_tactic_div_text_id = document.getElementById('selected_tactic_div_text_id');
    var extras_div = document.getElementById('extras_div');

    if (typeOftactic == 'predefined') {
        selected_tactic_div_text_id.innerHTML = 'Predefined tactic: ' + tacticSelected;
        extras_div.style.display = 'none';
    } else {
        selected_tactic_div_text_id.innerHTML = 'My ' + attackingOrDefending + ' tactic: ' + tacticSelected;
        extras_div.style.display = 'block';
    }



    //TODO: pull source code given that name, and display it on the bellow div
console.log(attackingOrDefending, " sdsd");
    if (typeOftactic == 'predefined') {
        TacticsManager.getPredefTactic(tacticSelected.trim(), attackingOrDefending == "attacking" ? "attack" : "defence")
            .then((data) => {
                $("#source_code_text").html(data);
            });
    } else {
        TacticsManager.getTacticData(localStorage.getItem("username"), tacticSelected, attackingOrDefending == "attacking" ? "attack" : "defence")
            .then((data) => {
                $("#source_code_text").html(data);
            });
    }


}

function deleteTactic() {
    var deleteTacticModal = document.getElementById('deleteTacticModal');
    deleteTacticModal.style.display = 'block';
}

function confirmDeleteTactic() {
    // TODO: delete from database


    var deleteTacticModal = document.getElementById('deleteTacticModal');
    deleteTacticModal.style.display = 'none';

    var view_selected_tactic_div = document.getElementById('view_selected_tactic_div');
    view_selected_tactic_div.style.display = 'none';

    var tactic2deleteTmp = document.getElementById('selected_tactic_div_text_id').innerText;
    var tactic2delete = "";
    if (tactic2deleteTmp.includes("attacking")) {
        tactic2delete = tactic2deleteTmp.replace("My attacking tactic: ", "");
        deleteTacticFromUI('attacking', tactic2delete);

        TacticsManager.deleteTactic(localStorage.getItem("username"), tactic2delete, "attack");

    } else {
        tactic2delete = tactic2deleteTmp.replace("My defending tactic: ", "");
        deleteTacticFromUI('defending', tactic2delete);

        TacticsManager.deleteTactic(localStorage.getItem("username"), tactic2delete, "defence");
    }

    var tactics_container = document.getElementById('tactics_container');
    tactics_container.style.display = "flex";
}

function cancelDeleteTactic() {
    var deleteTacticModal = document.getElementById('deleteTacticModal');
    deleteTacticModal.style.display = 'none';
}

/*********************************************************************************************************************** */
function resetLocalStorageVarsBeforeNewGame() {
    localStorage.removeItem("round");
    localStorage.removeItem("scoreTEAM1");
    localStorage.removeItem("scoreTEAM2");
}

function resetLocalStorageVarsOnLogOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("opponent");
}

/*********************************************************************************************************************** */
function disappearBtn(btn) {
    btn.style.display = 'none';
}

function appearBtn(btn) {
    btn.style.display = 'block';
}

function userClicked(div_holder) {
    var username = "";

    var pChildElem = div_holder.getElementsByTagName('p')[0];
    username = pChildElem.innerHTML;

    var playModal = document.getElementById('playModal');
    playModal.style.display = "block";

    var play_text = document.getElementById('play_text_id');
    play_text.innerText = 'Invite ' + username + ' to a game? '

    var invite_btn = document.getElementById('invite_holder_div');
    //var play_btn = document.getElementById('play_holder_div');
    var accept_btn = document.getElementById('accept_holder_div');
    var decline_btn = document.getElementById('decline_holder_div');
    var cancel_before_btn = document.getElementById('cancel_before_holder_div');
    var cancel_after_btn = document.getElementById('cancel_after_holder_div');

    //disappearBtn(play_btn);
    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
    disappearBtn(cancel_after_btn);

    appearBtn(invite_btn);
    appearBtn(cancel_before_btn);

    localStorage.setItem('opponent', username);
}

function inviteUser() {
    var username = localStorage.getItem('opponent');
    userStatus.invite(username).then(() => {
        console.log('sent invitation to ' + username);
        var play_text = document.getElementById('play_text_id');
        play_text.innerText = 'Invitation sent, waiting for reply...';

        var invite_btn = document.getElementById('invite_holder_div');
        //var play_btn = document.getElementById('play_holder_div');
        var accept_btn = document.getElementById('accept_holder_div');
        var decline_btn = document.getElementById('decline_holder_div');
        var cancel_before_btn = document.getElementById('cancel_before_holder_div');
        var cancel_after_btn = document.getElementById('cancel_after_holder_div');

        //disappearBtn(play_btn);
        disappearBtn(accept_btn);
        disappearBtn(decline_btn);
        disappearBtn(cancel_before_btn);
        disappearBtn(invite_btn);

        appearBtn(cancel_after_btn);
        document.getElementById('cancel_after_submit').style.display = 'inline-block';

    }).catch(() => {
    });
}

function receivedInvitation(opponent) {
    var playModal = document.getElementById('playModal');
    playModal.style.display = "block";

    var play_text = document.getElementById('play_text_id');
    play_text.innerText = opponent + ' has invited you to a game. '

    localStorage.setItem('opponent', opponent);

    var invite_btn = document.getElementById('invite_holder_div');
    //var play_btn = document.getElementById('play_holder_div');
    var accept_btn = document.getElementById('accept_holder_div');
    var decline_btn = document.getElementById('decline_holder_div');
    var cancel_before_btn = document.getElementById('cancel_before_holder_div');
    var cancel_after_btn = document.getElementById('cancel_after_holder_div');

    //disappearBtn(play_btn);
    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
    disappearBtn(cancel_before_btn);
    disappearBtn(invite_btn);
    disappearBtn(cancel_after_btn);

    appearBtn(accept_btn);
    appearBtn(decline_btn);
}

function invitationRejected(opponent) {
    var playModal = document.getElementById('playModal');
    playModal.style.display = "block";

    var play_text = document.getElementById('play_text_id');
    play_text.innerText = opponent + ' rejected your invitation. Maybe try to play with someone else? '

    var invite_btn = document.getElementById('invite_holder_div');
    // var play_btn = document.getElementById('play_holder_div');
    var accept_btn = document.getElementById('accept_holder_div');
    var decline_btn = document.getElementById('decline_holder_div');
    var cancel_before_btn = document.getElementById('cancel_before_holder_div');
    var cancel_after_btn = document.getElementById('cancel_after_holder_div');

    //disappearBtn(play_btn);
    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
    disappearBtn(cancel_before_btn);
    disappearBtn(invite_btn);
    disappearBtn(cancel_after_btn);
    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
}

function invitationAccepted(opponent) {


    localStorage.setItem('leftCourt', 'true');
    localStorage.setItem('attacker', 'true');


    var playModal = document.getElementById('playModal');
    playModal.style.display = "block";

    var play_text = document.getElementById('play_text_id');
    play_text.innerText = opponent + ' accepted your invitation. Starting Game..'

    localStorage.setItem('opponent', opponent);

    var invite_btn = document.getElementById('invite_holder_div');
    //var play_btn = document.getElementById('play_holder_div');
    var accept_btn = document.getElementById('accept_holder_div');
    var decline_btn = document.getElementById('decline_holder_div');
    var cancel_before_btn = document.getElementById('cancel_before_holder_div');
    var cancel_after_btn = document.getElementById('cancel_after_holder_div');

    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
    disappearBtn(cancel_before_btn);
    disappearBtn(invite_btn);
    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
    disappearBtn(cancel_after_btn);

    //appearBtn(play_btn);
    //document.getElementById('play_submit').style.display = 'inline-block';

    window.setTimeout(() => {
        playClicked();
    }, 1000);

}

function acceptInvitation() {
    userStatus.accept().then(() => {

        localStorage.setItem('leftCourt', 'false');
        localStorage.setItem('attacker', 'false');

        var playModal = document.getElementById('playModal');
        playModal.style.display = "none";

        resetLocalStorageVarsBeforeNewGame();


        window.location = "court.html";
    }).catch((err) => {
        console.log(err);
    });
}

function rejectInvitation() {
    userStatus.decline().then(() => {
        var playModal = document.getElementById('playModal');
        playModal.style.display = "none";

    }).catch(() => {
    });
}

function cancelInvitationBeforeSent() {
    var playModal = document.getElementById('playModal');
    playModal.style.display = "none";
}

function cancelInvitationAfterSent() {
    userStatus.cancel().then(() => {
        var play_text = document.getElementById('play_text_id');
        play_text.innerText = 'Invitation cancelled.';

        var invite_btn = document.getElementById('invite_holder_div');
        // var play_btn = document.getElementById('play_holder_div');
        var accept_btn = document.getElementById('accept_holder_div');
        var decline_btn = document.getElementById('decline_holder_div');
        var cancel_before_btn = document.getElementById('cancel_before_holder_div');
        var cancel_after_btn = document.getElementById('cancel_after_holder_div');

        // disappearBtn(play_btn);
        disappearBtn(accept_btn);
        disappearBtn(decline_btn);
        disappearBtn(cancel_before_btn);
        disappearBtn(invite_btn);
        disappearBtn(cancel_after_btn);
    }).catch(() => {
    });
}

function invitationCancelled(opponent) {
    var playModal = document.getElementById('playModal');
    playModal.style.display = "block";

    var play_text = document.getElementById('play_text_id');
    play_text.innerText = opponent + ' has cancelled their invitation. Close this window to go back to your start page. '

    var invite_btn = document.getElementById('invite_holder_div');
    //var play_btn = document.getElementById('play_holder_div');
    var accept_btn = document.getElementById('accept_holder_div');
    var decline_btn = document.getElementById('decline_holder_div');
    var cancel_before_btn = document.getElementById('cancel_before_holder_div');
    var cancel_after_btn = document.getElementById('cancel_after_holder_div');

    //disappearBtn(play_btn);
    disappearBtn(accept_btn);
    disappearBtn(decline_btn);
    disappearBtn(cancel_before_btn);
    disappearBtn(invite_btn);
    disappearBtn(cancel_after_btn);
}

function playClicked() {
    var playModal = document.getElementById('playModal');
    playModal.style.display = "none";

    resetLocalStorageVarsBeforeNewGame();


    window.location = "court.html";

}


/*********************************************************************************************************************** */


function populateUsersDiv(usersList) {
    var online_users_container_div = document.getElementById('online_users_container_div');

    online_users_container_div.innerHTML = ""; //clear



    for (var i in usersList) {
        if (usersList[i].username == localStorage.getItem('username')) { //exclude myself from the online users list
            continue;
        }

        var newUserDiv = document.createElement('div');
        newUserDiv.setAttribute('class', 'user_div');

        online_users_container_div.appendChild(newUserDiv);

        if (usersList[i].status == "online") {
            newUserDiv.setAttribute('role', 'button');
            newUserDiv.setAttribute('onclick', 'userClicked(this)');
            newUserDiv.innerHTML = '<img class="user_img_class" src="Resources/user_icon_online.png" /> <p class="username_class">' + usersList[i].username + '</p>';

        } else {
            newUserDiv.innerHTML = '<img class="user_img_class" src="Resources/user_icon_busy.png" /> <p class="username_class">' + usersList[i].username + '</p>';

        }

    }

}

function checkIfNeed2Redirect() {
    if (!UserManager.isLoggedIn() && !window.location.href.includes("index.html")) {
        window.location = "index.html";
    } else if (UserManager.isLoggedIn() && window.location.href.includes("index.html")) {
        window.location = "start_page.html";
    }
}

/***********************************************************************************************************************/

function loadTactcs() {
    TacticsManager.getTactics(localStorage.getItem('username')).then((data) => {
        data.forEach(tc => {
            var type = tc.type == "attack" ? "attacking" : "defending";
            addTactic2UI(type, tc.name);

        });
    }).catch((err) => {
        console.log("Error while trying to retrieve tactics");
    });
}

/*********************************************************************************************************************** */
var shouldDisplayOnlineUsers = false;

window.onload = function () {

    checkIfNeed2Redirect();

    if (UserManager.isLoggedIn())
        loadTactcs();

    if (UserManager.isLoggedIn()) {
        userStatus.connect(localStorage.getItem('username'));
        console.log("i am " + localStorage.getItem('username'));
    }

    /******************* USERS ******************** */
    var online_users_container_div = document.getElementById('online_users_container_div');
    if (online_users_container_div) {
        shouldDisplayOnlineUsers = true;
    }

    /*********************************************** */

    var registerModal = document.getElementById('registerModal');
    var loginModal = document.getElementById('loginModal');

    var deleteTacticModal = document.getElementById('deleteTacticModal');

    var source_code_box = document.getElementById('source_code_box');

    var addAttackingTacticmodal = document.getElementById('addAttackingTacticModal');
    var addDefendingTacticModal = document.getElementById('addDefendingTacticModal');
    var replaceTacticModal = document.getElementById('replaceTacticModal');
    var playModal = document.getElementById('playModal');


    var span = document.getElementsByClassName("close");

    // When the user clicks on <span> (x), close the modal
    if (span) {
        Array.from(span).forEach(possible_X => {
            possible_X.onclick = function () {

                if (playModal) {
                    if (playModal.style.display == 'block') {
                        playModal.style.display = 'none';
                        return; //because this could be open at the same time as other things with a close button, but we don't want the others to disappear just because the play modal does    
                    }
                }

                if (registerModal) {
                    registerModal.style.display = "none";
                }

                if (loginModal) {
                    loginModal.style.display = "none";
                }

                if (addAttackingTacticmodal) {
                    addAttackingTacticmodal.style.display = 'none';
                }

                if (addDefendingTacticModal) {
                    addDefendingTacticModal.style.display = 'none';
                }

                if (replaceTacticModal) {
                    if (replaceTacticModal.style.display == 'block') {
                        replaceTacticModal.style.display = 'none';
                        return; //because if this is open, so is the source code box, but we don't want the source code to disappear just because the delete modal does    
                    }
                }


                if (deleteTacticModal) {
                    if (deleteTacticModal.style.display == 'block') {
                        deleteTacticModal.style.display = 'none';
                        return; //because if this is open, so is the source code box, but we don't want the source code to disappear just because the delete modal does    
                    }
                }

                if (source_code_box) {
                    var view_selected_tactic_div = document.getElementById('view_selected_tactic_div');
                    view_selected_tactic_div.style.display = 'none';

                    var tactics_container = document.getElementById('tactics_container');
                    tactics_container.style.display = "flex";
                }


            }
        });

    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == registerModal) {
            if (registerModal) {
                registerModal.style.display = "none";
            }
        }

        if (event.target == loginModal) {
            if (loginModal) {
                loginModal.style.display = "none";
            }
        }

        if (event.target == deleteTacticModal) {
            if (deleteTacticModal) {
                deleteTacticModal.style.display = "none";
            }
        }

        if (event.target == addAttackingTacticmodal) {
            if (addAttackingTacticmodal) {
                addAttackingTacticmodal.style.display = "none";
            }
        }

        if (event.target == addDefendingTacticModal) {
            if (addDefendingTacticModal) {
                addDefendingTacticModal.style.display = "none";
            }
        }

        if (event.target == replaceTacticModal) {
            if (replaceTacticModal) {
                replaceTacticModal.style.display = "none";
            }
        }

        if (event.target == playModal) {
            if (playModal) {
                playModal.style.display = "none";

            }
        }

    }

};