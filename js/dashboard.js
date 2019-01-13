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
var moneyAmount;
var partyList;
$(document).ready(function () {
    getData(localStorage.getItem("username"), document.getElementById("userGrid"));
})
function getData(username, container) {
    while (container.firstChild)
        container.removeChild(container.firstChild);

    var userDoc = db.collection("users").doc(username);
    userDoc.get().then(function (doc) {
        var money = doc.data().pokecoins;
        var party = doc.data().party;
        renderData(party, container);
        if(username === localStorage.getItem("username")) {
            partyList = party;
            moneyAmount = money;
            initSelect(partyList);
        }
    })
}
function updateData(money, party) {
    var userDoc = db.collection("users").doc(localStorage.getItem("username"));
    userDoc.update({
        money: money,
        party: party
    })
}
function initSelect(party) {
    var select = document.getElementById("pokemon_select")
    for (var i = 0; i < party.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = party[i].name;
        select.appendChild(option);
    }
}
function removePokemon(index) {
    partyList.splice(index, 1);
    updateData(moneyAmount, partyList);
}
document.getElementById('submitSale').onclick = function () {
    var price = document.getElementById('sellPrice').value;
    var selected = document.getElementById('pokemon_select').selectedIndex;
    var pokemonName = document.getElementById('pokemon_select').options[selected].value;
    removePokemon(selected);
    addSale(localStorage.getItem("username"), pokemonName, price);
    document.getElementById('sellPrice').value = '';
    document.getElementById('pokemon_select').options[selected].value = '';
    renderMarketplace();
}
function addSale(seller, pokemon, price) {
    var forSale = db.collection("marketplace").doc("forSale");
    var uuid = guid();
    var obj = {
        seller: seller,
        pokemon: pokemon,
        price: price,
        reference: uuid
    }
    forSale.get().then(function (doc) {
        var d = doc.data();
        d[uuid] = obj;
        forSale.set(d);
    })
}
function renderMarketplace() {
    clearMarket();
    var forSale = db.collection('marketplace').doc("forSale");
    var container = document.getElementById("marketplace");
    forSale.get().then(function (doc) {
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
            container.appendChild(div);
        }
    })
}
var snapshotSale = db.collection("marketplace").doc("forSale");
snapshotSale.onSnapshot({
    includeMetadataChanges: true
}, function (doc) {
    clearMarket();
    var market = doc.data();
    var marketContainer = document.getElementById("marketplace");
    for (var key in market) {
        var sell = market[key];
        console.log("snapshot");
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
        marketContainer.appendChild(div)
    }
});
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
function renderData(party, container) {
    for (var i = 0; i < party.length; i++) {
        var containsAlready = false;
        var j = 0;
        for (j = 0; !containsAlready && j < container.children.length; j++) {
            if (container.children.item(j).innerHTML.toLowerCase() === party[i].name)
                containsAlready = true;
        }
        j--;

        if (containsAlready) {
            var countstr = container.children.item(j).getAttribute("count");
            var count = parseInt(countstr.substr(1, countstr.length - 2));
            container.children.item(j).setAttribute("count", "(" + (count + 1).toString() + ")");
        } else {
            var name = document.createElement('div');
            name.setAttribute('class', 'left');
            name.setAttribute('id', 'pokename');
            name.setAttribute('count', "(1)");
            name.innerHTML = party[i].name.charAt(0).toUpperCase() + party[i].name.substr(1, party[i].name.length - 1);
            container.appendChild(name);

            var icon = document.createElement('div');
            icon.setAttribute('class', 'right');
            var img = document.createElement('img');
            img.setAttribute('src', party[i].sprite);
            img.style.width = "40px";
            img.style.height = "40px";
            icon.appendChild(img);
            container.appendChild(icon);
        }
    }
}

document.getElementById("searchSubmit").onclick = function (e) {
    e.preventDefault();
    getData(document.getElementById("search-username").value, document.getElementById("searchGrid"));
}