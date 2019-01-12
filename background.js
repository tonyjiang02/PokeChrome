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
var db = firebase.firestore();
db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var req = request;
    createUser(request);
});
function createUser(credentials) {
    var user = credentials.user;
    var password = credentials.password;
    var data = {
        username:user,
        password:password
    }
    db.collection("users").doc(user).set(data).then() {
        console.log("successfully added user");
    }
}
function storeCredentials(credentials) {
    var username = credentials.username;
    var password = credentials.password;

}