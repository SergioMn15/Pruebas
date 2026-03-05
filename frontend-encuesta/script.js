// IMPORTANTE: Aquí pegarás la URL que te dé Render después
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
    const claveCorrecta = "TuPassword123"; // <-- ¡CAMBIA ESTO POR TU CLAVE!
    const intento = prompt("Introduce la contraseña de administrador:");

    if (intento !== claveCorrecta) {
        alert("Acceso denegado. Contraseña incorrecta.");
        return; // Detiene la ejecución si la clave está mal
    }

    // Si la clave es correcta, mostramos la vista admin y traemos los datos
    vistaUsuario.style.display = 'none';
    vistaAdmin.style.display = 'block';

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
                    <td>${new Date(fila.fecha_registro).toLocaleDateString()}</td>
                </tr>
            `;
        });
    } catch (error) {
        alert("Error al obtener datos de la base de datos.");
    }
});

// Volver al formulario
document.getElementById('btn-volver').addEventListener('click', () => {
    vistaAdmin.style.display = 'none';
    vistaUsuario.style.display = 'block';
});