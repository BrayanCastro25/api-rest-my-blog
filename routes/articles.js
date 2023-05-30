const express = require("express");
const router = express.Router();
const multer = require("multer");

const article_controller = require('../controllers/articles')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/articles/');
    },

    filename: (req, file, cb) => {
        cb(null, "article" + Date.now() + file.originalname);
    }
})


const uploads = multer({storage: storage});

// Rutas de prueba
router.get('/routes-of-test', article_controller.test)
router.get('/routes-of-courses', article_controller.courses)

// Ruta útil
router.post('/create', article_controller.create);
router.get('/get-articles', article_controller.getArticles);
router.get('/article/:id', article_controller.oneArticle);
router.delete('/article/:id', article_controller.deleteArticle);
router.put('/article/:id', article_controller.updateArticle);
router.post('/upload-image/:id', [uploads.single("file")], article_controller.uploadImage);
router.get('/image/:archive', article_controller.viewImage);
router.get('/search/:text_search', article_controller.search);

module.exports = router;    