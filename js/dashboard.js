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
function refreshAll() {
    clearParty();
    getData(localStorage.getItem("username"), document.getElementById("userGrid"));
    clearMarket();
}
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
function renderData(party, container) {
    while (container.firstChild)
        container.removeChild(container.firstChild);

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
function updateData(money, party) {
    var userDoc = db.collection("users").doc(localStorage.getItem("username"));
    userDoc.update({
        pokecoins: money,
        party: party
    })
}
function initSelect(party) {
    clearSelect();

    var select = document.getElementById("pokemon-select");
    for (var i = 0; i < party.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = party[i].name.charAt(0).toUpperCase() + party[i].name.substr(1, party[i].name.length - 1);
        select.appendChild(option);
    }
}
function removePokemon(index) {
    partyList.splice(index, 1);
    updateData(moneyAmount, partyList);
}
function clearSelect() {
    var select = document.getElementById("pokemon-select");
    while(select.firstChild)
        select.removeChild(select.firstChild);
}
document.getElementById('submitSale').onclick = function (e) {
    e.preventDefault();

    var price = document.getElementById('sellPrice').value;

    if (price <= 0) {
        document.getElementById('sell-error').innerHTML = "Prices must be positive";
    } else {
        document.getElementById('sell-error').innerHTML = "";
        var selected = document.getElementById('pokemon-select').selectedIndex;
        var pokemonName = document.getElementById('pokemon-select').options[selected].value;
        removePokemon(selected);
        addSale(localStorage.getItem("username"), pokemonName, price);
        document.getElementById('sellPrice').value = '';
        document.getElementById('pokemon-select').options[selected].value = '';
    }
}
function addSale(seller, pokemon, price) {
    var forSale = db.collection("marketplace").doc("forSale");
    var uuid = guid();
    var obj;
    $.ajax({
        type: "GET",
        url: url + pokemon.toLowerCase(),
        success: function (response, status, xhr) {
            var obj = {
                seller: seller,
                pokemon: pokemon,
                price: price,
                reference: uuid,
                icon: response.sprites['front_default']
            }

            forSale.get().then(function (doc) {
                var d = doc.data();
                d[uuid] = obj;
                forSale.set(d);
            })
        },
        error: function (xhr, status, error) {
        }
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
            var div = document.createElement('div');
            div.setAttribute('class', 'dealContainer');
            var seller = document.createElement('p');
            seller.setAttribute('class', 'sellerContainer');
            var pokemon = document.createElement('p');
            pokemon.setAttribute('class', 'nameContainer');
            var icon = document.createElement('img');
            icon.setAttribute('class', 'iconContainer');
            icon.setAttribute('src', sell.icon);
            var price = document.createElement('p');
            price.setAttribute('class', 'currencyContainer');
            var button = document.createElement('button')
            seller.innerHTML = sell.seller;
            pokemon.innerHTML = sell.pokemon.charAt(0).toUpperCase() + sell.pokemon.substr(1, sell.pokemon.length - 1);
            alert(pokemon.innerHTML);
            price.innerHTML = sell.price;
            div.setAttribute('reference', sell.reference);
            button.innerHTML = "Buy Pokemon";
            div.appendChild(pokemon);
            div.appendChild(icon);
            div.appendChild(seller);
            div.appendChild(price);
            div.appendChild(button);
            container.appendChild(div);
        }
    })
}
function clearParty(container) {
    while (container.firstChild)
        container.removeChild(container.firstChild);
}
var snapshotParty = db.collection("users").doc(localStorage.getItem("username"));
snapshotParty.onSnapshot({}, function(doc) {
    var container = document.getElementById("userGrid");
    getData(localStorage.getItem("username"), container);
})
var snapshotSale = db.collection("marketplace").doc("forSale");
snapshotSale.onSnapshot({}, function (doc) {
    clearMarket();
    var market = doc.data();
    var marketContainer = document.getElementById("marketplace");
    for (var key in market) {
        var sell = market[key];
        var div = document.createElement('div');
        div.setAttribute('class', 'dealContainer');
        var seller = document.createElement('p');
        seller.setAttribute('class', 'sellerContainer');
        var pokemon = document.createElement('p');
        pokemon.setAttribute('class', 'nameContainer');
        var icon = document.createElement('img');
        icon.setAttribute('class', 'iconContainer');
        icon.setAttribute('src', sell.icon);
        var price = document.createElement('p');
        price.setAttribute('class', 'currencyContainer');
        var button = document.createElement('button')
        seller.innerHTML = sell.seller;
        pokemon.innerHTML = sell.pokemon.charAt(0).toUpperCase() + sell.pokemon.substr(1, sell.pokemon.length - 1);
        price.innerHTML = sell.price;
        div.setAttribute('reference', sell.reference);
        button.innerHTML = "Buy Pokemon";
        button.setAttribute('class', "buyButton");
        div.appendChild(pokemon);
        div.appendChild(icon);
        div.appendChild(seller);
        div.appendChild(price);
        div.appendChild(button);
        marketContainer.appendChild(div)
    }
    addButtonListeners();
});
function addButtonListeners() {

    $(".buyButton").click(function (e) {
        e.preventDefault();

        var parent = $(this).parent().closest('div');
        var reference = parent.attr("reference");
        var forSale = db.collection('marketplace').doc("forSale");
        forSale.get().then(function (doc) {
            var data = doc.data();
            var sale = data[reference];
            var seller = sale.seller;
            var price = sale.price;
            var pokemon = sale.pokemon;
            var merchant = db.collection('users').doc(seller);
            merchant.get().then(function (doc) {
                var data = doc.data();
                data["pokecoins"] = parseInt(data["pokecoins"],10) + parseInt(price,10);
                merchant.set(data);
            })
            var receiver = db.collection('users').doc(localStorage.getItem("username"));
            receiver.get().then(function (doc) {
                var data = doc.data();
                data['pokecoins'] = parseInt(data['pokecoins'],10) - parseInt(price,10);
                var url = "https://pokeapi.co/api/v2/pokemon/";
                $.ajax({
                    type: "GET",
                    url: url + pokemon.toLowerCase(),
                    success: function (response, status, xhr) {
                        var obj = {
                            id: response.id,
                            name: response.name,
                            sprite: response.sprites['front_default']
                        }
                        data['party'].push(obj);
                        receiver.set(data);
                    },
                    error: function (xhr, status, error) {
                    }
                })
            })
            delete data[reference]
            forSale.set(data);
        })
    })

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

document.getElementById("searchSubmit").onclick = function (e) {
    e.preventDefault();
    getData(document.getElementById("search-username").value, document.getElementById("searchGrid"));
}