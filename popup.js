
document.getElementById("loginGrid").onsubmit = function(e){
    e.preventDefault();

    document.getElementById("loginGrid").style.display = "none";
    document.getElementById("main").style.display = "grid";
}