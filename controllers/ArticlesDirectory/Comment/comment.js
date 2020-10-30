const { validationResult } = require("express-validator/check");
const Comment = require("../../../models/ArticlesDirectory/Comment/comment");
const Reply = require("../../../models/ArticlesDirectory/Comment/reply");
const Article = require("../article");



exports.getArticleCommentsWithReplies = (req,res,next) => {
    const articleId = req.params.articleId;
    let articleComments = [];
    Article.findById(articleId)
        .then(article => {
            if (!article) {
                res.status(404).json({
                    message: "Article not found"
                })
            }
            return article.populate('Comments')
                .populate('Author')
                .execPopulate();
        })
        .then(articleWithCommentsPopulated => {
            articleWithCommentsPopulated.Comments.forEach(comment => {
                articleComments.push({text:comment.Text,postedOn: comment.postedOn,author: comment.Author.Username});
            });
            return res.status(200).json({
                message: "Comments fetched successfully",
                comments: articleComments
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

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
                res.status(404).json({
                    message: "Article Not found!"
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

exports.deleteComment = (req, res, next) => {
    let article;
    let comment;
    Article.findById(req.body.articleId)
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: "Article not found!"
                })
            }
            article = article;
            return Comment.findById(req.body.commentId);
        })
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found!"
                })
            }
            comment = comment;
            if (comment.Author == req.userId) {
                article.Comments = article.Comments.filter(comment => {
                    return comment != commentId;
                })
            }
            else {
                return res.status(401).json({
                    message: "Not Authorized"
                });
            }
            return article.save();
        })
        .then(articleSaved => {
            if (articleSaved) {
                return comment.remove();
            }
        })
        .then (commentRemoved => {
            if (commentRemoved) {
                res.status(200).json({
                    message: "Comment Successuly Deleted!"
                })
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
        
};

exports.editComment = (req, res, next) => {
        Comment.findById(req.body.commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            } else {
                if (comment.Author == req.userId) {
                    comment.Text = req.body.updatedText;
                    return comment.save();
                }
                return res.status(401).json({
                    message: "Not Authorized"
                });
            }
        })
        .then(commentSaved => {
            if (commentSaved) {
                return res.status(200).json({
                    message: "Comment edited successfully"
                });
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.likeComment = (req,res,next) => {
    Comment.findById(req.body.commentId)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found!"
                })
            }
            let wasLiked;
            comment.Likes = comment.Likes.filter(like => {
                if (like == userId) {
                    wasLiked = true;
                }
                return like!=req.userId;
            });
            
            if (!wasLiked) {
                comment.Likes.push(req.userId);
            }
            return comment.save();
        })
        .then(likeStatusUpdated => {
            if (likeStatusUpdated) {
                res.status(200).json({
                    message: "Comment Like Status Updated"
                })
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};