// Initialize Firebase
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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "login") {
        console.log("got message from popup");
        var req = request;
        if (request.isLogin) {
            console.log("request got");
            storeCredentials(request);
        }
        else {
            createUser(request);
        }
        spawnPokemon(1);
    } else if (request.msg === "click"){
        pokeClick(request.data);
    }else if (request.msg ==="openDashboard") {
        chrome.tabs.create({url:"./dashboard.html"})
    }
});
function spawnPokemon(id) {
    console.log("spawning Pokemon");
    $.ajax({
        type:"GET",
        url:url+id,
        success:function(response,status,xhr) {
            pokemondata = response;
            console.log("succeeded getting pokemon data")
            console.log(response);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id,{
                    msg:"spawn_pokemon",
                    pokemonData:response
                })
            })
        },
        error:function(xhr,status,error) {
            console.log(error)
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
    console.log("checking for duplicates")
    var master = db.collection("users").doc("master");
    master.get().then(function(doc) {
        var data = doc.data();
        var users = data.users;
        var found = false;
        for(var i =0; i<users.length; i++) {
            if(users[i] == user) {
                found = true;
                console.log("found user");
                break;
            }
        }
        if (!found) {
            users.push(user);
            var data1 = {
                users: users
            }
            db.collection("users").doc("master").set(data1).then(function() {
                console.log("updated users")
            })
            db.collection("users").doc(user).set(dataUser).then(function () {
                console.log("successfully added user");
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
        msg:"storage_set"
    })
}

function pokeClick(data){
    db.collection("users").doc(localStorage.getItem("username")).get().then(function(doc){
        party = doc.data().party;
        party.push(data);

        db.collection("users").doc(localStorage.getItem("username")).update({
            "party": party
        });
    });
}