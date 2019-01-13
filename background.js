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

// Initialize Cloud Firestore through Firebase
var globalUser;
var globalPassword;
var db = firebase.firestore();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
});
function spawnPokemon(id) {
    console.log("spawning Pokemon");
    chrome.runtime.sendMessage({
        msg:"spawn_pokemon",
        pokemon_id:id
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