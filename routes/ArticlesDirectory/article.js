const express = require("express");
const { body } = require("express-validator/check");

const articlesController = require("../../controllers/ArticlesDirectory/article");

const router = express.Router();

router.get("/get-all-articles",articlesController.getAllArticles);
router.get('/get-articles-by-topic/:topic',articlesController.getArticlesByTopic);
router.get("/get-article/:id",articlesController.getArticle);
router.post("/add-article",
[
    body("title")
    .trim()
    .not()
    .isEmpty(),
    body("body")
    .not()
    .isEmpty()
],articlesController.addArticle);



module.exports = router;

