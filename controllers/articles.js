const fs = require('fs');
const {validateData} = require('../helpers/validator');
const path = require("path");

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


const uploadImage = (req, res) => {
    
    // Configurar multer

    // Recoger el fichero de imagen subido

    // Nombre del archivo
    if(!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            message: "Petición Invalida"
        });
    }
    let name_file = req.file.originalname;
    
    // Extension del archivo
    let file_split = name_file.split('\.');
    let extension = file_split[1];

    // Comprobar extensión correcta
    if(extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                message: "Archivo invalido"
            }); 
        })
    }else{
        let id = req.params.id

        Articulo.findOneAndUpdate({_id: id}, {image: req.file.filename}, {new: true})
        .then((file_updated) => {
            if(!file_updated){
                return res.status(400).json({
                    status: "error",
                    message: "No se logró subir la imagen para el artículo por ID"
                });
            }
            return res.status(200).json({
                status: "success",
                file_updated,
                message: "Se subió la imagen del artículo por ID, satisfactoriamente"
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                error
            });
        })
    }

}

const viewImage = (req, res) => {
    let archive = req.params.archive;
    console.log(archive)
    let route_archive = "./images/articles/" + archive;

    fs.stat(route_archive, (error, exist) => {
        if(exist){
            return res.sendFile(path.resolve(route_archive));
        }else{
            return res.status(500).json({
                status: "error",
                error
            });
        }
    })
}

const search = (req, res) => {
    let text_search = req.params.text_search;

    Articulo.find({ "$or": [
        {"title" : {"$regex" : text_search, "$options" : "i"}},
        {"contents" : {"$regex" : text_search, "$options" : "i"}}
    ]}).sort({fecha: -1})
        .then((articulosEncontrados) => {
            if(!articulosEncontrados || articulosEncontrados.length <= 0){
                return res.status(400).json({
                    status: "error",
                    message: "No se logró encontrar ninguna coincidencia"
                });
            }
            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados,
                message: "Se encontraron las siguientes coincidencias"
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                error
            });
        })
}


module.exports = {
    test,
    courses, 
    create,
    getArticles, 
    oneArticle,
    deleteArticle,
    updateArticle,
    uploadImage,
    viewImage,
    search
}