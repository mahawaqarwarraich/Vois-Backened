const { validationResult } = require("express-validator/check");
const Article = require("../../models/ArticlesDirectory/article");
const helperFunctions = require("./helperFunctions");

exports.getAllArticles = (req,res,next) => {
    Article.find()
        .then(articles => {
            if (!articles) {
                res.status(422).json({
                    message: "Server could not fetch articles",
                    articles: articles
                });
            }
            res.status(200).json({
                message: "Articles fetched Successfuly",
                articles : articles
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getArticlesByTopic = (req,res,next) => {
    const articleTopic = req.params.topic;

    Article.find({Topic: articleTopic})
        .then(articles => {
            if (!articles) {
                res.status(422).json({
                    message: "Server could not fetch articles",
                    articles: articles
                });
            }
            res.status(200).json({
                message: "Articles by topics fetched successfuly",
                articles: articles
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getArticle = (req,res,next) => {
    const articleId = req.params.id;

    Article.findById(articleId)
        .then(article => {
            if(!article) {
                res.status(422).json({
                    message: "Server could not fetch the article",
                    article: article
                });
            }
            res.status(200).json({
                message: "Article fetched Successfuly",
                article: article
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
};


exports.addArticle = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const title = req.body.title;
    const topic = req.body.topic;
    const body = req.body.body;
    const author = req.userId;
    const secure_url = null;
    const public_id = null;

    if (req.file) {
        helperFunctions.uploadArticleCover(req.file.path,"articles/")
            .then(result => {
                console.log(result);
                const secure_url = result.secure_url;
                const public_id = result.public_id;
                return helperFunctions.createNewArticle(res,next,{title,topic,secure_url,public_id,body,author});
            });
    }
    else {
        return helperFunctions.createNewArticle(res,next,{title,topic,secure_url,public_id,body,author});
    }
};

exports.editArticle = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const articleId = req.body.articleId;
    Article.findById(articleId)
        .then(article => {
            if (!article) {
                res.status(404).json({
                    message: "Article not found"
                });
            }
            if (article.Author != req.userId) {
                return res.status(401).json({
                    message: "Not Authorized!"
                })
            }
            article.Title = req.body.title;
            article.Topic = req.body.topic;
            article.Body = req.body.body;
            
            return article.save();
        })
        .then(articleSaved => {
            if (articleSaved) {
                res.status(201).json({
                    message: "Article Edited Successfully"
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


exports.deleteArticle = (req,res,next) => {
    const articleId = req.body.articleId;
    Article.findById(articleId)
        .then(article => {
            if (!article) {
                res.status(404).json({
                    message: "Article not found!"
                })
            }
            if (article.Author == req.userId) {
                return article.remove();
            }
            res.status(401).json({
                message: "Not Authorized"
            });
        })
        .then(articleRemoved => {
            if (articleRemoved) {
                res.status(200).json({
                    message: "Article Successfully Removed"
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

exports.likeArticle = (req,res,next) => {
    Article.findById(req.body.articleId)
    .then(article => {
        if (!article) {
            return res.status(404).json({
                message: "Article not found!"
            })
        }
        let wasLiked;
        article.Likes = article.Likes.filter(like => {
            if (like == req.userId) {
                wasLiked = true;
            }
            return like!=req.userId;
        });
        
        if (!wasLiked) {
            article.Likes.push(req.userId);
        }
        return article.save();
    })
    .then(likeStatusUpdated => {
        if (likeStatusUpdated) {
            res.status(200).json({
                message: "Article Like Status Updated"
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


// const uploadArticleCover = path => {
//     return new Promise ((resolve, reject) => {
//         cloudinary.v2.uploader.upload(path,
//             { folder: "articles/",type:"private"},
//             (error,result)=>{
//                 if (error) {
//                     reject(error);
//                 }
//                 else {
//                     resolve(result);
//                 }
//             });
//     });
// }
//
// exports.addArticle = (req,res,next) => {
//     const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 		const error = new Error('Validation failed.');
// 		error.statusCode = 422;
// 		error.data = errors.array();
// 		throw error;
//     }
//
// 	const title = req.body.title;
// 	const topic = req.body.topic;
// 	const body = req.body.body;
//
//     if (req.file) {
//         uploadArticleCover(req.file.path)
//             .then(result => {
//                 console.log(result);
//                 return result;
//             })
//             .then (result => {
//                 return new Article({
//                     Title: title,
//                     Topic: topic,
//                     PictureSecureId: result.secure_url,
//                     PicturePublicId: result.public_id,
//                     Body: body
//                 }).save()
//             })
//             .then (newArticle => {
//                 return res.status(201).json({
//                     message: "New Article Created Successfully",
//                     article : newArticle
//                 });
//             })
//             .catch(error => {
//                 if (!error.statusCode) {
//                     error.statusCode = 500;
//                 }
//                 next(error);
//             });
//     }
//     else {
//         return new Article({
//             Title: title,
//             Topic: topic,
//             // PictureSecureId: result.secure_url,
//             // PicturePublicId: result.public_id,
//             Body: body
//         }).save().then (newArticle => {
//             return res.status(201).json({
//                 message: "New Article Created Successfully",
//                 article : newArticle
//             });
//         }).catch(error => {
//             if (!error.statusCode) {
//                 error.statusCode = 500;
//             }
//             next(error);
//         });
//     }
// };