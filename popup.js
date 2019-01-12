
document.getElementById("loginGrid").onsubmit = function(e){
    e.preventDefault();
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("password").value;
    var data = {
        username: username,
        password: password
    }
    chrome.runtime.sendMessage(data);
    document.getElementById("loginGrid").style.display = "none";
    document.getElementById("main").style.display = "grid";
}

window.onload = function() {
    document.getElementById("pokecoin-value").innerHTML = "0";
    document.getElementById("login-checkbox").checked = true;
}