const galeria = document.getElementById('pokemonGallery');
const filtroInput = document.getElementById('filterInput');
const btnPaginaAnterior = document.getElementById('prevPage');
const btnPaginaSiguiente = document.getElementById('nextPage');

let paginaActual = 0;
let todosPokemons = [];
let pokemonsFiltrados = [];
let estaFiltrando = false;

async function obtenerPokemons(pagina = 0) {
  const limite = 20;
  const desplazamiento = pagina * limite;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${desplazamiento}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

async function obtenerDetallesPokemon(nombre) {
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function mostrarPokemons(pokemons) {
  galeria.innerHTML = '';
  const promesas = pokemons.map(async (p) => {
    const detalles = await obtenerDetallesPokemon(p.name);
    const sprite = detalles.sprites.front_default;
    return `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 text-center">
        <div class="card h-100">
          <img src="${sprite || 'https://via.placeholder.com/96'}" class="card-img-top" alt="${p.name}" />
          <div class="card-body p-2">
            <h6 class="card-title">${p.name}</h6>
          </div>
        </div>
      </div>
    `;
  });
  const tarjetas = await Promise.all(promesas);
  galeria.innerHTML = tarjetas.join('');
}

async function cargarPagina(pagina) {
  estaFiltrando = false;
  filtroInput.value = '';
  paginaActual = pagina;
  const pokemons = await obtenerPokemons(pagina);
  await mostrarPokemons(pokemons);
  actualizarBotones();
}

function actualizarBotones() {
  btnPaginaAnterior.classList.toggle('disabled', paginaActual === 0);
}

async function filtrarPorNombre(nombre) {
  if (!todosPokemons.length) {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0');
    const data = await res.json();
    todosPokemons = data.results;
  }

  if (!nombre) {
    await cargarPagina(paginaActual);
    return;
  }

  estaFiltrando = true;
  pokemonsFiltrados = todosPokemons.filter(p => p.name.includes(nombre.toLowerCase()));
  await mostrarPokemons(pokemonsFiltrados.slice(0, 20));
  btnPaginaAnterior.classList.add('disabled');
  btnPaginaSiguiente.classList.add('disabled');
}

btnPaginaAnterior.addEventListener('click', () => {
  if (paginaActual > 0 && !estaFiltrando) {
    cargarPagina(paginaActual - 1);
  }
});

btnPaginaSiguiente.addEventListener('click', () => {
  if (!estaFiltrando) {
    cargarPagina(paginaActual + 1);
  }
});

filtroInput.addEventListener('input', (e) => {
  const valor = e.target.value.trim();
  filtrarPorNombre(valor);
});

cargarPagina(0);
