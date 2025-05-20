const apiUrl = 'http://localhost:8080/api/autos';

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarSeccion('inicio');
    cargarAutos();
});

// Manejo del formulario
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
    cargarAutos(); // Recargar autos desde el servidor
    mostrarSeccion('listado');
});

// Cargar autos desde API y renderizar tarjetas
async function cargarAutos() {
    const res = await fetch(apiUrl);
    const autos = await res.json();
    const contenedor = document.getElementById('autosContainer');

    contenedor.innerHTML = ''; // Limpiar contenido

    autos.forEach(auto => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg shadow-md fade-in-up border border-gray-200 transition duration-300 transform hover:scale-105 hover:shadow-xl hover:border-black cursor-pointer';

        card.innerHTML = `
            <h3 class="text-lg font-bold mb-2">${auto.marca} - ${auto.modelo} <span class="text-gray-500">(${auto.color})</span></h3>
            <p class="text-sm text-gray-700 mb-2">Placas: ${auto.placas}</p>
            <button class="text-red-500 hover:text-red-700 text-sm" onclick="eliminarAuto(${auto.id})">Eliminar</button>
        `;

        contenedor.appendChild(card);
    });
}

// Eliminar auto
async function eliminarAuto(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    cargarAutos(); // Recargar después de eliminar
}

// Mostrar secciones según navegación
function mostrarSeccion(seccion) {
    document.getElementById('inicio').style.display = (seccion === 'inicio') ? 'block' : 'none';
    document.getElementById('registro').style.display = (seccion === 'registro') ? 'block' : 'none';
    document.getElementById('listado').style.display = (seccion === 'listado') ? 'block' : 'none';
}

// Eventos del navbar
document.getElementById('nav-inicio').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarSeccion('inicio');
});

document.getElementById('nav-registro').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarSeccion('registro');
});

document.getElementById('nav-listado').addEventListener('click', (e) => {
    e.preventDefault();
    cargarAutos();
    mostrarSeccion('listado');
});
