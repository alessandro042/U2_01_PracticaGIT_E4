const apiUrl = 'http://localhost:8080/api/autos';

document.getElementById('autoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const auto = {
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        color: document.getElementById('color').value,
        placas: document.getElementById('placas').value
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auto)
    });

    e.target.reset();
    cargarAutos();
});

async function cargarAutos() {
    const res = await fetch(apiUrl);
    const autos = await res.json();
    const contenedor = document.getElementById('autosContainer');

    contenedor.innerHTML = autos.map(auto => `
    <div>
      <p><strong>${auto.marca}</strong> - ${auto.modelo} (${auto.color})</p>
      <p>Placas: ${auto.placas}</p>
      <button onclick="eliminarAuto(${auto.id})">Eliminar</button>
    </div>
  `).join('');
}



document.addEventListener('DOMContentLoaded', cargarAutos);