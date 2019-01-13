// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRyVEh2975haA9Yi3aGaRfO-LBcY8E93c",
    authDomain: "pokechrome-73fa4.firebaseapp.com",
    databaseURL: "https://pokechrome-73fa4.firebaseio.com",
    projectId: "pokechrome-73fa4",
    storageBucket: "pokechrome-73fa4.appspot.com",
    messagingSenderId: "758158114370"
};
firebase.initializeApp(config);
db = firebase.firestore();
function hasUsername(username, data) {
    var master = db.collection("users").doc("master");
    master.get().then(function (doc) {
        var docList = doc.data();
        var users = docList.users;
        var found = false;
        for (var i = 0; i < users.length; i++) {
            if (users[i] == username) {
                found = true;
                break;
            }
        }    

        if (found) {
            notUnique();
        } else {
            loginSuccess(data);
        }
    })
}
function checkPassword(username, password, data) {
    var doc = db.collection('users').doc(username);
    doc.get().then(function(doc) {
        var pass = doc.data().password;
        if(password === pass) {
            loginSuccess(data)
        }else{
            passwordError();
        }
    }).catch(function(error) {
        passwordError();
    })
}
function getMoney(username, password) {
    var document = db.collection("users").doc(username);
    document.get().then(function (doc) {
        if(password == doc.data().password) {
            var money = doc.data().pokecoins;
            setMoney(money)
        }
    })
}
function setMoney(money) {
    document.getElementById("pokecoin-value").innerHTML = money;
}
function notUnique() {
    var error = document.getElementById("error");
    error.innerHTML = "Username already exists";
}
function passwordError() {
    var error = document.getElementById("error");
    error.innerHTML = "Password incorrect or user doesn't exist";
}
function login(isLogin, username, password) {
    var data = {
        msg: "login",
        isLogin: isLogin,
        username: username,
        password: password
    }
    if(isLogin) {
        checkPassword(username,password,data);
    } else {
        hasUsername(username,data);
    }
}
function loginSuccess(data) {
    chrome.runtime.sendMessage(data);
    document.getElementById("error").innerHTML = "";
    document.getElementById("loginGrid").style.display = "none";
    document.getElementById("main").style.display = "grid";
}

function logout() {
    localStorage.clear();
    document.getElementById("loginGrid").style.display = "grid";
    document.getElementById("main").style.display = "none";
}

document.getElementById("login-checkbox").onclick = function () {
    var color;
    if (document.getElementById("login-checkbox").checked) {
        color = getComputedStyle(document.body).getPropertyValue('--login-color');
    } else {
        color = getComputedStyle(document.body).getPropertyValue('--create-acc-color');
    }

    document.getElementById("login-submit").style.backgroundColor = color;
    document.getElementById("login-submit").style.borderColor = color;
}

document.getElementById("loginGrid").onsubmit = function (e) {
    e.preventDefault();
    var isLogin = document.getElementById("login-checkbox").checked;
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;

    login(isLogin, username, password);
}

document.getElementById("spawn").onclick = function () {
    chrome.runtime.sendMessage({
        msg: "spawn"
    });
}
function validate() {
    document.getElementById("loginGrid").style.display = "none";
    document.getElementById("main").style.display = "grid";
}
document.getElementById("logout").onclick = function () {
    logout();
}
document.getElementById("showDashboard").onclick = function () {
    chrome.runtime.sendMessage({
        msg: "openDashboard"
    })
}

window.onload = function () {
    if (localStorage.getItem("username")) {
        validate();
        login(true, localStorage.getItem("username"), localStorage.getItem("password"));
        getMoney(localStorage.getItem("username"), localStorage.getItem("password"));
    }

    document.getElementById("login-checkbox").checked = true;
    document.getElementById("pokecoin-value").innerHTML = "--";
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "storage_set") {
        var username = localStorage.getItem("username");
        var password = localStorage.getItem("password");
        getMoney(username, password);
    }
})
