const express = require("express");
const router = express.Router();

const article_controller = require('../controllers/articles')

// Rutas de prueba
router.get('/ruta-de-prueba', article_controller.test)
router.get('/ruta-de-cursos', article_controller.courses)


module.exports = router;    