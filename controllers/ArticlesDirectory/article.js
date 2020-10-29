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
        return helperFunctions.createNewArticle(res,next,{title,topic,secure_url,public_id,body});
    }
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