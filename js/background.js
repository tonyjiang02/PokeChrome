

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
// Initialize Cloud Firestore through Firebase
var globalUser;
var globalPassword;
var db = firebase.firestore();
var idPokemon = [[10, 13, 16, 17, 19, 20, 21, 22, 23, 27, 28, 29, 30, 32, 33, 39, 41, 42, 43, 44, 46, 47, 48, 49, 50, 52, 54, 55, 56, 60, 66, 67, 69, 70, 72, 73, 74, 75, 79, 80, 81, 84, 85, 86, 88, 96, 98, 100, 116, 118, 129, 130],
[11, 14, 24, 51, 53, 57, 82, 87, 97, 99, 101, 109, 114, 119],
[35, 37, 71, 83, 89, 92, 95, 117],
[12, 15, 40, 45, 58, 61, 64, 68, 77, 93, 102, 111],
[25, 26, 62, 63, 104, 105, 108, 110, 112, 128],
[78, 120, 124],
[36, 90, 91, 132],
[106, 107, 113, 115, 122, 123, 126, 127, 147, 148],
[1, 4, 7, 125, 131, 133, 143],
[2, 3, 5, 6, 8, 9, 18, 31, 34, 38, 59, 65, 76, 94, 103, 121, 134, 135, 136, 137, 138, 139, 140, 141, 142, 144, 145, 146, 149, 150, 151]];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "login") {
        if (request.isLogin) {
            storeCredentials(request);
        }
        else {
            createUser(request);
        }
    } else if (request.msg === "spawn") {
        mixedSpawn();
    } else if (request.msg === "click") {
        pokeClick(request.data);
    } else if (request.msg === "openDashboard") {
        chrome.tabs.create({ url: "/dashboard.html" })
    }
});
function mixedSpawn() {
    base = 10;
    power = 3;
    x = Math.random() * base;
    rarity = Math.floor(Math.pow(x, power) / Math.pow(base, power - 1));
    pokeList = idPokemon[rarity];
    spawnPokemon(pokeList[Math.floor(Math.random() * pokeList.length)]);
}
var rand = 20000
var interval;
function randomize() {
    if (localStorage.getItem("username")) {
        mixedSpawn();
        rand = Math.round(Math.random() * (60000 - 20000)) + 20000;
        clearInterval(interval);
        interval = setInterval('randomize()', rand)
    }
}
interval = setInterval('randomize()', rand);
function spawnPokemon(id) {
    $.ajax({
        type: "GET",
        url: url + id,
        success: function (response, status, xhr) {
            pokemondata = response;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    msg: "spawn_pokemon",
                    pokemonData: response
                })
            })
        },
        error: function (xhr, status, error) {
        }
    })
}

function createUser(credentials) {
    var user = credentials.username;
    var password = credentials.password;
    var dataUser = {
        username: user,
        password: password,
        pokecoins: 0,
        party: []
    }
    globalUser = user;
    globalPassword = password;
    var master = db.collection("users").doc("master");
    master.get().then(function (doc) {
        var data = doc.data();
        var users = data.users;
        var found = false;
        for (var i = 0; i < users.length; i++) {
            if (users[i] == user) {
                found = true;
                break;
            }
        }
        if (!found) {
            users.push(user);
            var data1 = {
                users: users
            }
            db.collection("users").doc("master").set(data1).then(function () {
            })
            db.collection("users").doc(user).set(dataUser).then(function () {
                storeCredentials(credentials);
            });
        }
    })
}
function storeCredentials(credentials) {
    var username = credentials.username;
    var password = credentials.password;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    chrome.runtime.sendMessage({
        msg: "storage_set"
    })
}

function pokeClick(data) {
    db.collection("users").doc(localStorage.getItem("username")).get().then(function (doc) {
        party = doc.data().party;
        party.push(data);

        db.collection("users").doc(localStorage.getItem("username")).update({
            "party": party
        });
    });
}