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
    } else {
        document.getElementById("login-checkbox").checked = true;
    }

    document.getElementById("pokecoin-value").innerHTML = "0";
}