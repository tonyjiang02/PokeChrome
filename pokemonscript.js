var pokemonData;

console.log("CONTENT SCRIPT INITIALIZED")
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.msg === "spawn_pokemon"){
        console.log("message from background")
        pokemonData = request.pokemonData;
        console.log(pokemonData);
        
        createOverlay();
    }
})

function createOverlay() {
    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay-pokecoin-pokemon');
    
    var label = document.createElement('label');
    label.setAttribute('id', 'label-pokecoin-pokemon');
    label.innerHTML = "!!! A Wild Pokemon Has Appeared !!!";
    overlay.appendChild(label);

    var sprite = document.createElement('img');
    sprite.setAttribute('id', 'sprite-pokecoin-pokemon');
    sprite.setAttribute('src', pokemonData.sprites['front_default']);
    sprite.setAttribute('draggable', 'false');
    sprite.onclick = function(){
        chrome.runtime.sendMessage({
            msg: "click",
            data: {
                "id": pokemonData.id,
                "name": pokemonData.name,
                "sprite": pokemonData.sprites['front_default']
            }
        })

        document.getElementById("overlay-pokecoin-pokemon").remove();
    };
    overlay.appendChild(sprite);

    document.body.appendChild(overlay);
}