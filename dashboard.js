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
function getData() {
    var userDoc = db.collection("users").doc(username);
    userDoc.get().then(function(doc) {
        money = doc.data().pokecoins;
        party = doc.data().party;
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
    var names = document.getElementById('names');
    var sprites = document.getElementById('sprites');
}