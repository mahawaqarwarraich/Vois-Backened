const { validationResult } = require("express-validator/check");
const Comment = require("../../../models/ArticlesDirectory/Comment/comment");
const Article = require("../article");

exports.addNewComment = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error ('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const commentText = req.body.text;
    const articleId      = req.body.articleId;

    let article, newComment;
    Article.findById(articleId)
        .then(article => {
            if (!article) {
                res.status(422).json({
                    message: "Server could not process the article"
                })
            }
            article = article;
            return new Comment({
                Text: commentText,
                Author: req.userId
            }).save();
        })
        .then(newComment => {
            if (newComment) {
                newComment = newComment;
                article.Comments.push(newComment);
                return article.save();
            }
        })
        .then(savedArticleWithComment => {
            res.status(201).json({
                message: "Comment successfuly added to the article",
                comment: newComment
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.deleteComment = (req,res,next) => {
};

exports.editComment = (req,res,next) => {

};

exports.likeComment = (req,res,next) => {

};