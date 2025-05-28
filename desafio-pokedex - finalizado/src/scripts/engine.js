// elemento UL/OL onde os pokemons serão listados.
const pokemonList = document.getElementById('pokemonList');

// botão para carregar mais pokemons.
const loadMoreButton = document.getElementById('loadMoreButton')



maxRecords = 151; // Número total de Pokémons (1ª geração)
const limit = 10; // Quantos Pokémons carregar por vez
let offset = 0;   // A partir de qual Pokémon começar



function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemons.forEach((pokemon) => {
      const li = document.createElement('li');
      li.className = `pokemon ${pokemon.type}`;
      li.innerHTML = `
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      `;

      // Adiciona o evento diretamente ao elemento
      li.addEventListener('click', () => {
        console.log('Pokémon clicado:', pokemon.name); // Debug
        pokeDetails(pokemon);
      });

      pokemonList.appendChild(li);
    });
  });
}

loadPokemonItens(offset, limit)

/* ==================== BOTÃO DE CARREGAR MAIS POKEMONS ======================== */

// quando clicado aumenta o offset.
loadMoreButton.addEventListener('click', () => {
  offset += limit // Aumenta o offset para pegar os próximos

  const qtdeRecordNextPage = offset + limit
  // verificar se a próxima página ultrapassa o número de pokemons e se sim remove o botão.
  if (qtdeRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset
    loadPokemonItens(offset, limit)

    loadMoreButton.parentElement.removeChild(loadMoreButton) // Remove o botão
    // se não carrega os 10 pokemons normalmente.
  } else {
    loadPokemonItens(offset, limit)
  }
})


/* ==================== EXEBIR OS DETALHES DOS POKEMONS ======================== */
async function pokeDetails(pokemon) {
  const modal = document.getElementById('pokemonModal')
  const modalContent = modal.querySelector('.modal-content');
  const modalBody = modal.querySelector('.modal-body')


  // Remove classes de tipo anteriores
  modalContent.className = 'modal-content';
  
  // Adiciona classe do tipo principal
  modalContent.classList.add(pokemon.type.split(',')[0]); // Pega o primeiro tipo


  // Mostra um loader enquanto busca mais dados.
  modalBody.innerHTML = '<div class="loader">Carregando...</div>'
  modal.style.display = 'flex'

  // Impede que o evento de clique propague para o modal.
  modal.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
  })
  // try serve para caputurar erros dentro de uma função async.
  try {
    // Busca informações adicionais
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.number}`)
    const details = await response.json()

    // Preenche o modal com todas as informações.
    modalBody.innerHTML = `
    <div class="pokemon-detail"${pokemon.type}>
      <span class="number">#${pokemon.number}</span>
      <h2 class="name">${pokemon.name}</h2>
      <div class="detail">
      <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
        <img src="${details.sprites.other['official-artwork'].front_default || pokemon.photo}" 
               alt="${pokemon.name}" class="detail-image">
          
          
        <div class="status-page">
          <div class="status">
            <h3>Estatisticas</h3>
            ${details.stats.map(stat => `
              <div class="stat-row">
                  <span class="stat-name">${stat.stat.name}</span>
                  <span class="stat-value">${stat.base_stat}</span>
                </div>
              `).join(' ')}
              </div>
              
              <div class="physical">
                <p> Altura: ${details.height / 10}m</p>
                <p> Peso: ${details.weight / 10}Kg</p>
              </div>  
        </div>      
      </div>  
    </div>  
          `
  } catch (error) {
    modalBody.innerHTML = '<p>Erro ao carregar detalhes</p>'
    console.log('Erro ao carregar detalhes:', error)
  }

  //fecha o modal quando clica no X.
  modal.querySelector('.close-modal').onclick = () => {
    modal.style.display = 'none'
  }

  //fecha modal quando clicar fora do conteudo.
  modal.onclick = () => {
    modal.style.display = 'none'
  }
}

