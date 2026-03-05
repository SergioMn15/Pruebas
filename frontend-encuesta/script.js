// Tu URL oficial de Render
const URL_BACKEND = "https://backend-encuesta-zkgb.onrender.com"; 

const vistaUsuario = document.getElementById('vista-usuario');
const vistaAdmin = document.getElementById('vista-admin');

// --- 1. ENVIAR DATOS (USUARIO) ---
document.getElementById('form-encuesta').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        comentario: document.getElementById('comentario').value
    };

    try {
        const response = await fetch(`${URL_BACKEND}/insertar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("¡Datos guardados con éxito en Aiven!");
            e.target.reset();
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor de Render.");
    }
});

// --- 2. VER DATOS (ADMIN) CON CONTRASEÑA ---
document.getElementById('btn-ver-admin').addEventListener('click', async () => {
    const claveCorrecta = "admin"; // <-- ¡Esta es tu contraseña actual!
    const intento = prompt("Introduce la contraseña de administrador:");

    if (intento !== claveCorrecta) {
        alert("Acceso denegado. Contraseña incorrecta.");
        return;
    }

    // Cambiamos de vista
    vistaUsuario.style.display = 'none';
    vistaAdmin.style.display = 'block';

    // Cargamos los datos inmediatamente
    cargarDatos();
});

// Función para traer los datos de Render y Aiven
async function cargarDatos() {
    try {
        const response = await fetch(`${URL_BACKEND}/ver-datos`);
        const datos = await response.json();
        
        const cuerpoTabla = document.querySelector('#tabla-datos tbody');
        cuerpoTabla.innerHTML = ""; 

        datos.forEach(fila => {
            cuerpoTabla.innerHTML += `
                <tr>
                    <td>${fila.nombre_usuario}</td>
                    <td>${fila.correo}</td>
                    <td>${fila.comentario}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="borrarRegistro(${fila.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        alert("Error al obtener datos de la base de datos.");
    }
}

// --- 3. BORRAR REGISTRO ---
window.borrarRegistro = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

    try {
        const response = await fetch(`${URL_BACKEND}/borrar/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Registro eliminado con éxito.");
            cargarDatos(); // Refrescamos la tabla automáticamente
        } else {
            alert("Error al intentar eliminar.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor para borrar.");
    }
};

// Volver al formulario (Cerrar sesión)
document.getElementById('btn-volver').addEventListener('click', () => {
    vistaAdmin.style.display = 'none';
    vistaUsuario.style.display = 'block';
});