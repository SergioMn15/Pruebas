const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión mejorada usando la Variable de Entorno de Render
// Esto lee automáticamente la URI que pegaste en el panel de Render
const connection = mysql.createConnection(process.env.DATABASE_URL || "mysql://avnadmin:AVNS_7UYGgRi99NPIiGMy_jH@mysql-ca7af69-colima-77c6.k.aivencloud.com:10509/defaultdb?ssl-mode=REQUIRED");

// Ruta para recibir datos del formulario (Usuario)
app.post('/insertar', (req, res) => {
    const { nombre, correo, comentario } = req.body;
    const sql = "INSERT INTO respuestas_encuesta (nombre_usuario, correo, comentario) VALUES (?, ?, ?)";
    
    connection.query(sql, [nombre, correo, comentario], (err, result) => {
        if (err) {
            console.error("Error al insertar:", err);
            return res.status(500).send(err);
        }
        res.send("¡Dato guardado en la nube!");
    });
});

// Ruta para ver datos (Admin)
app.get('/ver-datos', (req, res) => {
    connection.query("SELECT * FROM respuestas_encuesta ORDER BY fecha_registro DESC", (err, results) => {
        if (err) {
            console.error("Error al consultar:", err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});