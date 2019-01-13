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

}