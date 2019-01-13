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
        callback(party);
    })
}
function updateData(money, party) {
    var userDoc = db.collection("users").doc(username);
    userDoc.update({
        money: money,
        party: party
    })
}
function renderData(party) {
    var partyGrid = document.getElementById("partyGrid");
    for(var i = 0; i < party.length; i++) {
        var containsAlready = false;
        var j = 0;
        for (j = 0; !containsAlready && j < partyGrid.children.length; j++) {
            if (partyGrid.children.item(j).innerHTML.toLowerCase() === party[i].name)
                containsAlready = true;
        }
        j--;

        if (containsAlready){
            var countstr = partyGrid.children.item(j).getAttribute("count");
            var count = parseInt(countstr.substr(1, countstr.length - 2));
            partyGrid.children.item(j).setAttribute("count", "(" + (count + 1).toString() + ")");
        } else {
            var name = document.createElement('div');
            name.setAttribute('class','left');
            name.setAttribute('id', 'pokename');
            name.setAttribute('count', "(1)");
            name.innerHTML = party[i].name.charAt(0).toUpperCase() + party[i].name.substr(1, party[i].name.length - 1);
            partyGrid.appendChild(name);

            var icon = document.createElement('div');
            icon.setAttribute('class','right');
            var img = document.createElement('img');
            img.setAttribute('src', party[i].sprite);
            img.style.width = "40px";
            img.style.height = "40px";
            icon.appendChild(img);
            partyGrid.appendChild(icon);
        }
    }
}