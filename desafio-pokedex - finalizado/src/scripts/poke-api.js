/* ==================== REQUISIÇÃO HTTP ======================== */

// objeto vazio

const pokeApi = {};

// converte os dados brutos da API em um objeto mais simples

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

// recebe um objeto pokemon base, faz a requisição e converter em JSON e passa os dados para a função acima.

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

// constroi a URL com offset e limit para paginação.

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  // faz a requisição para a PokeAPI.
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  // converte o retorno para JSON.
  return (
    fetch(url)
      .then((response) => response.json())
      // extrai a lista de pokemons (results).
      .then((jsonBody) => jsonBody.results)
      // para cada pokemon na lista chama o getPokemonDetail para obter dados mais completos.
      .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
      // usa o promise.all para aguardar todas as requisições terminarem.
      .then((detailRequests) => Promise.all(detailRequests))
      // retorna a promise com a lista de pokemons processados.
      .then((pokemonsDetails) => {
        loadedPokemons = loadedPokemons.concat(pokemonsDetails);
        return pokemonsDetails;
      })
  );
};
