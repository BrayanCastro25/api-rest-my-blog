const validator = require("validator");

const validateData = (parameters) => {
    let validar_titulo = !validator.isEmpty(parameters.title) 
    let validar_contenido = !validator.isEmpty(parameters.content); 

    if(!validar_contenido || !validar_titulo){
        throw new Error("No se ha validado la información");
    }
}

module.exports = {
    validateData
}