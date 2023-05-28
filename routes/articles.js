const express = require("express");
const router = express.Router();

const article_controller = require('../controllers/articles')

// Rutas de prueba
router.get('/routes-of-test', article_controller.test)
router.get('/routes-of-courses', article_controller.courses)

// Ruta útil
router.post('/create', article_controller.create)
router.get('/get-articles', article_controller.getArticles)
router.get('/article/:id', article_controller.oneArticle)
router.delete('/article/:id', article_controller.deleteArticle)
router.put('/article/:id', article_controller.updateArticle)


module.exports = router;    