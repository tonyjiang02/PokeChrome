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

function logout(){
    localStorage.clear();
    document.getElementById("loginGrid").style.display = "grid";
    document.getElementById("main").style.display = "none";
}

document.getElementById("login-checkbox").onclick = function(){
    var color;
    if (document.getElementById("login-checkbox").checked){
        color = getComputedStyle(document.body).getPropertyValue('--login-color');
    } else {
        color = getComputedStyle(document.body).getPropertyValue('--create-acc-color');
    }

    document.getElementById("login-submit").style.backgroundColor = color;
    document.getElementById("login-submit").style.borderColor = color;
}

document.getElementById("loginGrid").onsubmit = function(e){
    e.preventDefault();
    var isLogin = document.getElementById("login-checkbox").checked;
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;

    login(isLogin, username, password);
}

document.getElementById("logout").onclick = function(){
    logout();
}

window.onload = function() {
    if (localStorage.getItem("username")) {
        login(false, localStorage.getItem("username"), localStorage.getItem("password"));
    } else {
        document.getElementById("login-checkbox").checked = true;
    }

    document.getElementById("pokecoin-value").innerHTML = "0";
}