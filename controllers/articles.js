const {validateData} = require('../helpers/validator');

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
        validateData(parameters)
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    // Crear el objeto a guardar
    const new_article = new Articulo(parameters);

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
    Articulo.find({}).sort({date: -1}).limit(1)
        .then((articles) => {
            if(!articles) {
                return res.status(400).json({
                    status: "error",
                    message: "No se encontraron articulos..."
                });
            }
            return res.status(200).send({
                status: "success",
                counter: articles.length,
                articles
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

const oneArticle = (req, res) => {
    // Obtener un ID por la URL
    let id = req.params.id;
    
    // Buscar el artículo
    Articulo.findById(id)
        .then((article) => {
            // Si no existe devolver error
            if(!article) {
                return res.status(400).json({
                    status: "error",
                    message: "No se encontró el artículo especificado..."
                });
            }
            // Devolver resultado
            return res.status(200).send({
                status: "success",
                article
            });
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al buscar el artículo por ID",
                error: error.message
            });
        })

}


const deleteArticle = (req, res) => {
    let id = req.params.id;
    
    Articulo.findOneAndDelete({_id: id})
        .then((articulo_deleted) => {
            if(!articulo_deleted){
                return res.status(400).json({
                    status: "error",
                    message: "No se logró eliminar el artículo por ID..."
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Se eliminó el objeto exitosamente",
                articulo_deleted
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al eliminar el artículo por ID",
                error: error.message
            });
        })
}


const updateArticle = (req, res) => {
    // Obtener ID por la URL
    let id = req.params.id;

    // Recoger datos del body
    let parameters = req.body;

    // Validar datos
    try{
        validateData(parameters)
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({_id: id}, parameters, {new: true})
        .then((article_updated) => {
            if(!article_updated){
                return res.status(400).json({
                    status: "error",
                    message: "No se logró actualizar el artículo por ID"
                });
            }
            return res.status(200).json({
                status: "success",
                article_updated,
                message: "Se actualizó el artículo por ID, satisfactoriamente"
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                error
            });
        })


    // Dar una respuesta
}

module.exports = {
    test,
    courses, 
    create,
    getArticles, 
    oneArticle,
    deleteArticle,
    updateArticle
}