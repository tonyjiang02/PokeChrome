var pokemonData;
var url = "https://pokeapi.co/api/v2/pokemon/";
console.log("CONTENT SCRIPT INITIALIZED")
getData(1);
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.msg === "spawn_pokemon"){
        var pokemonId = request.pokemon_id;
    }
})
function getData(id) {
    $.ajax({
        type:"GET",
        url:url+id,
        success:function(response,status,xhr) {
            pokemondata = response;
            console.log("succeeded getting pokemon data")
            console.log(response);
        },
        error:function(xhr,status,error) {
            console.log(error)
        }
    })
}
function createOverlay(id) {

}