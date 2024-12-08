const express = require("express");
const { body } = require("express-validator");

const articleTopicController = require("../../controllers/ArticlesDirectory/article-topic");

const router = express.Router();

router.get('/get-topics',articleTopicController.getArticleTopics);
router.get('/get-article-topics',articleTopicController.getArticleTopicNames);

router.post('/add-article-topic',
[
    body("topicname")
    .not()
    .isEmpty(),
    body("description")
    .not()
    .isEmpty()
],
articleTopicController.addNewArticleTopic);


module.exports = router;