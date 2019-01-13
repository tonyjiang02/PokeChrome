var config = {
    apiKey: "AIzaSyCRyVEh2975haA9Yi3aGaRfO-LBcY8E93c",
    authDomain: "pokechrome-73fa4.firebaseapp.com",
    databaseURL: "https://pokechrome-73fa4.firebaseio.com",
    projectId: "pokechrome-73fa4",
    storageBucket: "pokechrome-73fa4.appspot.com",
    messagingSenderId: "758158114370"
};
firebase.initializeApp(config);
var url = "https://pokeapi.co/api/v2/pokemon/";
db = firebase.firestore();
var party;
var money;
var username = localStorage.getItem("username");
var password = localStorage.getItem("password");
$(document).ready(function() {
    getData(renderData);
})
function getData(callback) {
    var userDoc = db.collection("users").doc(username);
    userDoc.get().then(function(doc) {
        money = doc.data().pokecoins;
        party = doc.data().party;
        console.log(party);
        console.log(money);
        callback();
    })
}
function updateData() {
    var userDoc = db.collection("users").doc(username);
    userDoc.update({
        money: money,
        party: party
    })
}
function renderData() {
    var container = document.getElementById("container");
    for(var i =0; i<party.length; i++) {
        var row = document.createElement('div');
        row.setAttribute('class','row');
        var col1 = document.createElement('div');
        col1.setAttribute('class','col-md-2');
        var col2 = document.createElement('div');
        col2.setAttribute('class','col-md-4');
        col1.innerHTML =party[i].name;
        var img = document.createElement('img');
        img.setAttribute('src', party[i].sprite);
        img.style.width = "40px";
        img.style.height = "40px";
        col2.appendChild(img);
        row.appendChild(col1);
        row.appendChild(col2); 
        container.appendChild(row);
    }
}