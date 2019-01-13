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
$(document).ready(function () {
    getData(renderData);
    renderMarketplace();
})
function getData(callback) {
    var userDoc = db.collection("users").doc(username);
    userDoc.get().then(function (doc) {
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
    for (var i = 0; i < party.length; i++) {
        var row = document.createElement('div');
        row.setAttribute('class', 'row');
        var col1 = document.createElement('div');
        col1.setAttribute('class', 'col-md-2');
        var col2 = document.createElement('div');
        col2.setAttribute('class', 'col-md-4');
        col1.innerHTML = party[i].name;
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
function addSale(seller, pokemon, price) {
    var forSale = db.collection("marketplace").doc("forSale");
    var uuid = guid();
    var obj = {
        seller:seller,
        pokemon:pokemon,
        price:price,
        reference:uuid
    }
    forSale.update({
        uuid:obj
    })
}
function renderMarketplace() {
    var forSale = db.collection("marketplace").doc("forSale");
    forSale.onSnapshot({
        includeMetadataChanges: true
    }, function (doc) {
        clearMarket();
        var market = doc.data();
        for (var key in market) {
            var sell = market[key];
            console.log(sell);
            var div = document.createElement('div');
            var seller = document.createElement('p');
            var pokemon = document.createElement('p');
            var price = document.createElement('p');
            var button = document.createElement('button')
            seller.innerHTML = sell.seller;
            pokemon.innerHTML = sell.pokemon;
            price.innerHTML = sell.price;
            div.setAttribute('reference', sell.reference);
            button.innerHTML = "Buy Pokemon";
            div.appendChild(seller);
            div.appendChild(pokemon);
            div.appendChild(price);
            div.appendChild(button);
        }
    });
}
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function clearMarket() {
    var market = document.getElementById("marketplace");
    while (market.firstChild) {
        market.removeChild(market.firstChild);
    }
}