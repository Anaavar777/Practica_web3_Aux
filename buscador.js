const btnBuscar = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const tipoBusqueda = document.getElementById("tipoBusqueda");
const tbody = document.querySelector("#tablaResultados tbody");

async function buscarDigimon() {
  let baseURL = "https://digimon-api.vercel.app/api/digimon";
  let url = baseURL;
  const query = inputBuscar.value.trim();
  if (tipoBusqueda.value === "name" && query !== "") {
    url = `${baseURL}/name/${encodeURIComponent(query)}`;
  } else if (tipoBusqueda.value === "level" && query !== "") {
    url = `${baseURL}/level/${encodeURIComponent(query)}`;
  }  else {
    tbody.innerHTML = "";
    alert("Por favor ingresa un valor para buscar por nombre o nivel.");
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error en la respuesta");
    const data = await res.json();
    if (!Array.isArray(data)) {
      tbody.innerHTML = `<tr><td colspan="2">No se encontraron resultados.</td></tr>`;
      return;
    }
    renderizarTabla(data);
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="2">Error al obtener datos.</td></tr>`;
    console.error(error);
  }
}
function renderizarTabla(digimons) {
  if (digimons.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2">No se encontraron resultados.</td></tr>`;
    return;
  }
  tbody.innerHTML = digimons.map(d => `
    <tr>
      <td>${d.name}</td>
      <td>${d.level}</td>
    </tr>
  `).join('');
}
btnBuscar.addEventListener("click", buscarDigimon);
inputBuscar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    buscarDigimon();
  }
});
