// Variables globales
let ubicacionCapturada = null;

// Elementos de la UI
const selectorDiv = document.getElementById('selectorArchivo');
const appDiv = document.getElementById('appPrincipal');
const btnCargarArchivo = document.getElementById('btnCargarArchivo');
const btnCrearNuevo = document.getElementById('btnCrearNuevo');
const inputFile = document.getElementById('inputFileExcel');
const mensajeInicial = document.getElementById('mensajeInicial');

// Elementos de la app principal
const clienteSelect = document.getElementById('cliente');
const visitaSelect = document.getElementById('visita');
const btnUbicacion = document.getElementById('btnUbicacion');
const ubicacionDiv = document.getElementById('ubicacionMostrada');
const btnGuardar = document.getElementById('btnGuardar');
const mensajeDiv = document.getElementById('mensaje');

// Funciones auxiliares de mensajes
function mostrarMensaje(elemento, texto, tipo = 'success') {
    elemento.textContent = texto;
    elemento.className = `mensaje ${tipo}`;
    setTimeout(() => {
        elemento.className = 'mensaje';
    }, 4000);
}

// Cargar lista de clientes desde el backend (solo después de tener archivo)
async function cargarClientes() {
    try {
        const resp = await fetch('/api/clientes');
        const data = await resp.json();
        if (data.success && data.clientes.length) {
            clienteSelect.innerHTML = '<option value="">-- Selecciona un cliente --</option>';
            data.clientes.forEach(cli => {
                const option = document.createElement('option');
                option.value = cli;
                option.textContent = cli;
                clienteSelect.appendChild(option);
            });
        } else {
            clienteSelect.innerHTML = '<option value="">No hay clientes</option>';
            mostrarMensaje(mensajeDiv, 'No se encontraron clientes en el Excel', 'error');
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje(mensajeDiv, 'Error al cargar la lista de clientes', 'error');
    }
}

// Inicializar la aplicación principal (se llama después de tener el archivo listo)
function inicializarApp() {
    selectorDiv.style.display = 'none';
    appDiv.style.display = 'block';
    cargarClientes();
    
    // Configurar eventos de la app principal
    btnUbicacion.addEventListener('click', capturarUbicacion);
    btnGuardar.addEventListener('click', guardarDatos);
}

// Captura de geolocalización
function capturarUbicacion() {
    if (!navigator.geolocation) {
        mostrarMensaje(mensajeDiv, 'Tu navegador no soporta geolocalización', 'error');
        return;
    }

    btnUbicacion.disabled = true;
    btnUbicacion.textContent = '📍 Obteniendo ubicación...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            ubicacionCapturada = `${lat},${lng}`;
            ubicacionDiv.textContent = ubicacionCapturada;
            mostrarMensaje(mensajeDiv, 'Ubicación capturada correctamente', 'success');
            btnUbicacion.disabled = false;
            btnUbicacion.textContent = '📍 Capturar mi ubicación actual';
        },
        (error) => {
            console.error(error);
            let errorMsg = 'No se pudo obtener la ubicación. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Permiso denegado. Habilita la ubicación en tu celular.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Ubicación no disponible.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Tiempo de espera agotado.';
                    break;
                default:
                    errorMsg += 'Error desconocido.';
            }
            mostrarMensaje(mensajeDiv, errorMsg, 'error');
            btnUbicacion.disabled = false;
            btnUbicacion.textContent = '📍 Capturar mi ubicación actual';
            ubicacionCapturada = null;
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

async function guardarDatos() {
    const cliente = clienteSelect.value;
    const tipoVisita = visitaSelect.value;

    if (!cliente) {
        mostrarMensaje(mensajeDiv, 'Selecciona un cliente', 'error');
        return;
    }
    if (!tipoVisita) {
        mostrarMensaje(mensajeDiv, 'Selecciona Semanal o Quincenal', 'error');
        return;
    }
    if (!ubicacionCapturada) {
        mostrarMensaje(mensajeDiv, 'Primero captura tu ubicación actual con el botón GPS', 'error');
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    try {
        const resp = await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente, tipoVisita, ubicacion: ubicacionCapturada })
        });
        const data = await resp.json();
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
        } else {
            mostrarMensaje(mensajeDiv, data.message || 'Error al guardar', 'error');
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje(mensajeDiv, 'Error de conexión con el servidor', 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = '💾 Guardar registro en Excel';
    }
}

// --- Lógica de selección inicial ---
btnCrearNuevo.addEventListener('click', async () => {
    mostrarMensaje(mensajeInicial, 'Creando archivo nuevo...', 'success');
    try {
        const resp = await fetch('/api/create-new-excel', { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            mostrarMensaje(mensajeInicial, 'Archivo creado correctamente. Cargando aplicación...', 'success');
            setTimeout(() => inicializarApp(), 1000);
        } else {
            mostrarMensaje(mensajeInicial, 'Error al crear el archivo', 'error');
        }
    } catch (error) {
        mostrarMensaje(mensajeInicial, 'Error de conexión al crear archivo', 'error');
    }
});

btnCargarArchivo.addEventListener('click', () => {
    inputFile.click();
});

inputFile.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('excelFile', file);

    mostrarMensaje(mensajeInicial, 'Subiendo archivo...', 'success');
    try {
        const resp = await fetch('/api/upload-excel', {
            method: 'POST',
            body: formData
        });
        const data = await resp.json();
        if (data.success) {
            mostrarMensaje(mensajeInicial, 'Archivo cargado exitosamente. Cargando aplicación...', 'success');
            setTimeout(() => inicializarApp(), 1000);
        } else {
            mostrarMensaje(mensajeInicial, data.message || 'Error al subir el archivo', 'error');
        }
    } catch (error) {
        mostrarMensaje(mensajeInicial, 'Error de conexión al subir archivo', 'error');
    }
    inputFile.value = ''; // limpiar para poder cargar el mismo archivo nuevamente
});