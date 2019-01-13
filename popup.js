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
function getMoney(username, password) {
    var document = db.collection("users").doc(username);
    document.get().then(function(doc) {
        console.log(doc.data());
        var money = doc.data().pokecoins;
        setMoney(money)
    })
}
function setMoney(money) {
    document.getElementById("pokecoin-value").innerHTML = money;
}
function login(isLogin, username, password) {
    var data = {
        isLogin: isLogin,
        username: username,
        password: password
    }

    chrome.runtime.sendMessage(data);
    document.getElementById("loginGrid").style.display = "none";
    document.getElementById("main").style.display = "grid";
}

document.getElementById("loginGrid").onsubmit = function(e){
    e.preventDefault();
    var isLogin = document.getElementById("login-checkbox").checked;
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;

    login(isLogin, username, password);
}

window.onload = function() {
    if (localStorage.getItem("username")) {
        login(false, localStorage.getItem("username"), localStorage.getItem("password"));
        getMoney(localStorage.getItem("username"), localStorage.getItem("password"));
    } else {
        document.getElementById("login-checkbox").checked = true;
    }
    document.getElementById("pokecoin-value").innerHTML = "--";
}
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.msg === "storage_set"){
        console.log("finished storage")
        var username = localStorage.getItem("username");
        var password = localStorage.getItem("password");
        getMoney(username, password);
    }
})
    