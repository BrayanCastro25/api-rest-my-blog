const validator = require("validator");

const test = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de artículos" 
    });
}

const courses = (req, res) => {
    console.log("Se ha ejecutado el end-pont /test");
    return res.status(200).json([{
        course: "Master en React",
        autor: "Víctor Robles"
    },{
        course: "Python Ultimate",
        autor: "Nícolas Schurmann"
    }]);
}   

const create = (req, res) => {

    // Recoger parámetros por POST a guardar
    let parameters = req.body;

    // Validar datos
    try{
        let validar_titulo = !validator.isEmpty(parameters.title) && validator.isLength(parameters.title, {min: 5, max: 15}); 
        let validar_contenido = !validator.isEmpty(parameters.content); 

        if(!validar_contenido || !validar_titulo){
            throw new Error("No se ha validado la información");
        }
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    // Crear el objeto a guardar

    // Asignar valores a objeto basado en el modelo (manual o autómatico)

    // Guardar el articulo en la base de datos

    return res.status(200).json({
        mensaje: "Acción de guardar",
        parameters
    })
}

module.exports = {
    test,
    courses, 
    create
}