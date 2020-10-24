const express = require("express");
const { body } = require("express-validator/check");

const articlesController = require("../../controllers/ArticlesDirectory/article");

const router = express.Router();

router.get("/show-all-articles",articlesController.showAllArticles);
router.get("/show-article/:id",articlesController.showArticle);
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

