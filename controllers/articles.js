const validator = require("validator");

const Articulo = require("../models/Articles");

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
        let validar_titulo = !validator.isEmpty(parameters.title) 
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
    const new_article = new Articulo(parameters);

    // Asignar valores a objeto basado en el modelo (manual o autómatico)

    // Guardar el articulo en la base de datos
    new_article.save()
        .then((articleSaved) => {
            console.log(articleSaved);
            return res.status(200).json({
                status: "success",
                article: articleSaved,
                message: "Article was saved successfully!!"
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                status: "error",
                message: "Article was not saved..."
            });
        })
}

const getArticles = (req, res) => {
    Articulo.find({})
        .then((articles) => {
            if(!articles) {
                return res.status(400).json({
                    status: "error",
                    message: "No se encontraron articulos..."
                });
            }
            return res.status(200).send({
                status: "success",
                articles,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al listar los articulos",
                error: error.message
            });
        })

    
}

module.exports = {
    test,
    courses, 
    create,
    getArticles
}