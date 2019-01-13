var pokemonData;

console.log("CONTENT SCRIPT INITIALIZED")
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.msg === "spawn_pokemon"){
        alert("Got Message");
        console.log("message from background")
        pokemonData = request.pokemonData;
        console.log(pokemonData);
    }
})
function createOverlay(id) {
    var overlayStyle = document.createElement("link");

    overlayStyle.type = "text/css";
    overlayStyle.rel = "stylesheet";
    overlayStyle.href = "overlayStyle.css";
    document.head.appendChild(overlayStyle);

    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');
    
    var sprite = document.createElement('img');
    sprite.setAttribute('src', "icon.png");

    overlay.appendChild(sprite);
    document.body.appendChild(overlay);
}