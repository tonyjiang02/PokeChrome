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

$(document).ready(function() {
    getData(localStorage.getItem("username"), document.getElementById("userGrid"));
})
function getData(username, container) {
    while(container.firstChild) 
        container.removeChild(container.firstChild);

    var userDoc = db.collection("users").doc(username);
    userDoc.get().then(function(doc) {
        money = doc.data().pokecoins;
        party = doc.data().party;
        renderData(party, container);
    })
}
function updateData(money, party) {
    var userDoc = db.collection("users").doc(localStorage.getItem("username"));
    userDoc.update({
        money: money,
        party: party
    })
}
function renderData(party, container) {
    for(var i = 0; i < party.length; i++) {
        var containsAlready = false;
        var j = 0;
        for (j = 0; !containsAlready && j < container.children.length; j++) {
            if (container.children.item(j).innerHTML.toLowerCase() === party[i].name)
                containsAlready = true;
        }
        j--;

        if (containsAlready){
            var countstr = container.children.item(j).getAttribute("count");
            var count = parseInt(countstr.substr(1, countstr.length - 2));
            container.children.item(j).setAttribute("count", "(" + (count + 1).toString() + ")");
        } else {
            var name = document.createElement('div');
            name.setAttribute('class','left');
            name.setAttribute('id', 'pokename');
            name.setAttribute('count', "(1)");
            name.innerHTML = party[i].name.charAt(0).toUpperCase() + party[i].name.substr(1, party[i].name.length - 1);
            container.appendChild(name);

            var icon = document.createElement('div');
            icon.setAttribute('class','right');
            var img = document.createElement('img');
            img.setAttribute('src', party[i].sprite);
            img.style.width = "40px";
            img.style.height = "40px";
            icon.appendChild(img);
            container.appendChild(icon);
        }
    }
}

document.getElementById("searchSubmit").onclick = function(e){
    e.preventDefault();
    getData(document.getElementById("search-username").value, document.getElementById("searchGrid"));
}