const express = require("express");
const router = express.Router();

const article_controller = require('../controllers/articles')

// Rutas de prueba
router.get('/routes-of-test', article_controller.test)
router.get('/routes-of-courses', article_controller.courses)

// Ruta útil
router.post('/create', article_controller.create)

module.exports = router;    