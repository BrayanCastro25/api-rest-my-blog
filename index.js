// Importar librería conection
const { conection }= require("./database/conection");
const express = require("express");
const cors = require("cors");

console.log("App de Node iniciada");

// Ejecutar función de conexión a base de datos
conection(); 

// Crear servidor node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); // form-urlencoded

// RUTAS
const rutas_articulo = require('./routes/articles');

// Cargo las rutas
app.use("/api", rutas_articulo);

// Rutas hardcodeadas
app.get("/", (req, res) => {
    console.log("Se ha ejecutado el end-pont /");
    return res.status(200).send(`
        <h1>Inicio</h1>
    `);
});

// Crear servidor y escuchar rutas
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port);
});