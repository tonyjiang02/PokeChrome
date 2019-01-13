chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.msg === "spawn_pokemon"){
        pokemonData = request.pokemonData;
        
        createOverlay(pokemonData);
    }
})

function createOverlay(pokemonData) {
    var overlay = document.getElementById("overlay-pokecoin-pokemon");
    if (!overlay){
        overlay = document.createElement('div');
        overlay.setAttribute('id', 'overlay-pokecoin-pokemon');
    }

    var posX = Math.floor(Math.random() * 82);
    var posY = Math.floor(Math.random() * 67);
    
    var label = document.createElement('label');
    label.setAttribute('id', 'label-pokecoin-pokemon');
    label.innerHTML = "!!! A Wild Pokémon Has Appeared !!!";
    label.style.left = posX.toString() + "%";
    label.style.top = posY.toString() + "%";
    overlay.appendChild(label);

    var sprite = document.createElement('img');
    sprite.setAttribute('id', 'sprite-pokecoin-pokemon');
    sprite.setAttribute('src', pokemonData.sprites['front_default']);
    sprite.setAttribute('draggable', 'false');
    sprite.style.left = (posX + 5).toString() + "%";
    sprite.style.top = (posY + 5).toString() + "%";
    sprite.onclick = function(e){
        var parentNode = e.srcElement.parentElement;
        var spriteNode = e.srcElement;
        var labelNode = e.srcElement.previousSibling;
        chrome.runtime.sendMessage({
            msg: "click",
            data: {
                "id": pokemonData.id,
                "name": pokemonData.name,
                "sprite": pokemonData.sprites['front_default']
            }
        })

        spriteNode.remove();
        labelNode.remove();
        if (parentNode.children.length == 0) 
                parentNode.remove();
    };
    overlay.appendChild(sprite);

    document.body.appendChild(overlay);
}