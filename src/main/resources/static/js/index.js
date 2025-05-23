const apiUrl = 'http://localhost:8080/api/autos';

function mostrarSeccion(id) {
    console.log(`Attempting to show section: ${id}`);
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.remove('active');
    });
    const sectionToShow = document.getElementById(id);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
        setTimeout(() => {
            sectionToShow.classList.remove('fade-in-up');
            void sectionToShow.offsetWidth;
            sectionToShow.classList.add('fade-in-up');
        }, 0);
    } else {
        console.error(`Section with id '${id}' not found.`);
    }
}

async function handleAutoFormSubmit(e) {
    e.preventDefault();
    console.log('Registrar form submitted');

    const auto = {
        marca: document.getElementById('marca').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        color: document.getElementById('color').value.trim(),
        placas: document.getElementById('placas').value.trim(),
        cliente: document.getElementById('cliente').value.trim()
    };

    if (!auto.marca || !auto.modelo || !auto.placas) {
        Swal.fire({
            title: 'Campos obligatorios',
            text: 'Marca, Modelo y Placas son campos obligatorios.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(auto)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al registrar el auto. Status: ${response.status}. Detalles: ${errorData}`);
        }

        e.target.reset();
        await cargarAutos();
        mostrarSeccion('listado');

        Swal.fire({
            title: '¡Éxito!',
            text: 'Auto registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } catch (error) {
        console.error('Error registering auto:', error);
        Swal.fire({
            title: 'Error',
            text: `Error al registrar el auto: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

async function cargarAutos() {
    console.log('Cargando autos...');
    const contenedor = document.getElementById('autosContainer');
    if (!contenedor) {
        console.error('Elemento autosContainer no encontrado.');
        return;
    }
    contenedor.innerHTML = '<p class="text-gray-500 col-span-full text-center p-4">Cargando autos...</p>';

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error al cargar los autos. Status: ${res.status}. Server says: ${errorText}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await res.text();
            throw new Error("La respuesta del servidor no es JSON. Contenido: " + errorText);
        }

        const autos = await res.json();
        console.log('Autos recibidos de la API:', autos);
        contenedor.innerHTML = '';

        if (!Array.isArray(autos)) {
            contenedor.innerHTML = '<p class="text-red-500 col-span-full text-center p-4">Error: Los datos recibidos no tienen el formato esperado.</p>';
            return;
        }

        if (autos.length === 0) {
            contenedor.innerHTML = '<p class="text-gray-500 col-span-full text-center p-4">No hay autos registrados.</p>';
            return;
        }

        autos.forEach((auto, index) => {
            const autoDataForModal = {
                id: auto.id ?? `temp_id_${index}_${Date.now()}`,
                marca: auto.marca || 'N/A',
                modelo: auto.modelo || 'N/A',
                color: auto.color || 'N/A',
                placas: auto.placas || 'N/A',
                cliente: auto.cliente || 'N/A'
            };

            let autoJsonString;
            try {
                autoJsonString = JSON.stringify(autoDataForModal).replace(/'/g, '&#39;');
            } catch (e) {
                console.error(`Error al convertir auto a JSON:`, e);
                const errorCard = document.createElement('div');
                errorCard.className = 'bg-red-100 text-red-700 p-4 rounded-lg shadow-md border border-red-300';
                errorCard.innerHTML = `<h3 class="font-bold">Error al Procesar Auto</h3><p>Marca: ${autoDataForModal.marca}, Modelo: ${autoDataForModal.modelo}</p>`;
                contenedor.appendChild(errorCard);
                return;
            }

            const card = document.createElement('div');
            card.className = 'bg-white p-5 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 hover:scale-[1.03]';
            card.innerHTML = `
                <div class="mb-3">
                    <h3 class="text-xl font-bold text-gray-800">${autoDataForModal.marca} - ${autoDataForModal.modelo}</h3>
                    <p class="text-sm text-gray-500">Color: ${autoDataForModal.color}</p>
                </div>
                <p class="text-sm text-gray-700 mb-1"><span class="font-medium">Placas:</span> ${autoDataForModal.placas}</p>
                <p class="text-sm text-gray-700 mb-4"><span class="font-medium">Cliente:</span> ${autoDataForModal.cliente}</p>
                <div class="flex justify-end gap-2 border-t border-gray-200 pt-3">
                    <button class="text-blue-600 border border-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md" onclick='abrirModalEditar(${autoJsonString})'>Editar</button>
                    <button class="text-red-600 border border-red-500 hover:bg-red-50 px-4 py-2 rounded-md" onclick="eliminarAuto('${autoDataForModal.id}')">Eliminar</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error en cargarAutos:', error);
        contenedor.innerHTML = `<p class="text-red-500 col-span-full text-center p-4">Error al cargar autos: ${error.message}</p>`;
    }
}

async function eliminarAuto(id) {
    console.log(`Intentando eliminar auto con ID: ${id}`);
    if (!id || id.startsWith('temp_id_')) {
        Swal.fire({
            title: 'Error',
            text: 'Este auto no tiene un ID válido para ser eliminado.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const confirmResult = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmResult.isConfirmed) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al eliminar el auto. Status: ${response.status}. Detalles: ${errorData}`);
        }

        Swal.fire({
            title: 'Eliminado',
            text: 'Auto eliminado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        await cargarAutos();
    } catch (error) {
        console.error('Error deleting auto:', error);
        Swal.fire({
            title: 'Error',
            text: `Error al eliminar el auto: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function abrirModalEditar(auto) {
    if (!auto || typeof auto !== 'object') {
        Swal.fire({
            title: 'Error',
            text: 'Datos inválidos para editar el auto.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    document.getElementById('editarId').value = auto.id ?? '';
    document.getElementById('editarMarca').value = auto.marca || '';
    document.getElementById('editarModelo').value = auto.modelo || '';
    document.getElementById('editarColor').value = auto.color || '';
    document.getElementById('editarPlacas').value = auto.placas || '';
    document.getElementById('editarCliente').value = auto.cliente || '';

    const modal = document.getElementById('modalEditar');
    const modalContent = document.getElementById('modalEditarContent');

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    });
}


function cerrarModal() {
    const modal = document.getElementById('modalEditar');
    const modalContent = document.getElementById('modalEditarContent');

    modalContent.classList.add('scale-95', 'opacity-0');
    modalContent.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function handleEditFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editarId').value;
    const auto = {
        marca: document.getElementById('editarMarca').value.trim(),
        modelo: document.getElementById('editarModelo').value.trim(),
        color: document.getElementById('editarColor').value.trim(),
        placas: document.getElementById('editarPlacas').value.trim(),
        cliente: document.getElementById('editarCliente').value.trim()
    };

    if (!auto.marca || !auto.modelo || !auto.placas) {
        Swal.fire({
            title: 'Campos obligatorios',
            text: 'Marca, Modelo y Placas son campos obligatorios.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(auto)
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Error al actualizar el auto. Status: ${res.status}. Detalles: ${errorBody}`);
        }

        cerrarModal();
        await cargarAutos();
        mostrarSeccion('listado');

        Swal.fire({
            title: 'Actualizado',
            text: 'Auto actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } catch (error) {
        console.error('Error in handleEditFormSubmit:', error);
        Swal.fire({
            title: 'Error',
            text: `Error al guardar los cambios: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado y parseado.');
    mostrarSeccion('inicio');
    cargarAutos();

    const navInicio = document.getElementById('nav-inicio');
    if (navInicio) navInicio.addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('inicio'); });

    const navRegistro = document.getElementById('nav-registro');
    if (navRegistro) navRegistro.addEventListener('click', (e) => { e.preventDefault(); mostrarSeccion('registro'); });

    const navListado = document.getElementById('nav-listado');
    if (navListado) navListado.addEventListener('click', (e) => { e.preventDefault(); cargarAutos(); mostrarSeccion('listado'); });

    const autoForm = document.getElementById('autoForm');
    if (autoForm) autoForm.addEventListener('submit', handleAutoFormSubmit);

    const formEditarAuto = document.getElementById('formEditarAuto');
    if (formEditarAuto) formEditarAuto.addEventListener('submit', handleEditFormSubmit);
});
