const { validationResult } = require("express-validator/check");
const Article = require("../../models/ArticlesDirectory/article");
const helperFunctions = require("./helperFunctions");

exports.getAllArticles = (req,res,next) => {
    Article.find()
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Found",
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



exports.getFavArticles = (req,res,next) => {
    Article.find()
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Found",
                    articles: articles
                });
            }

            favArticles = articles.map(article => {
                let isArticleFav = false;
                article.Likes.forEach(like => {
                    if (like == req.userId) {
                        isArticleFav = true;
                    }
                });

                if (isArticleFav) {
                    return article;
                }
                return false;
            });

            return favArticles.filter(favArticle => {
                if (favArticle!=null) {
                    return favArticle;
                }
            });
        })
        .then(result => {
            res.status(200).json({
                message: "Fav Articles Fetched",
                favArticles: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                error.statusCode = 500;
            }
            next(err);
        });
}


exports.getLatestFavArticles = (req,res,next) => {
    Article.find()
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Found",
                    articles: articles
                });
            }

            favArticles = articles.map(article => {
                let isArticleFav = false;
                article.Likes.forEach(like => {
                    if (like == req.userId) {
                        isArticleFav = true;
                    }
                });

                if (isArticleFav) {
                    return article;
                }
                return false;
            });

            return favArticles.filter(favArticle => {
                if (favArticle!=null) {
                    return favArticle;
                }
            });
        })
        .then (favArticles => {
            if (favArticles.length >3) {
                return [favArticles[0],favArticles[1],favArticles[2]]
            } 
            return favArticles;
        })
        .then(result => {
            res.status(200).json({
                message: "Latest Favourite Articles Fetched",
                favArticles: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                error.statusCode = 500;
            }
            next(err);
        });
}


exports.getMyBlogs = (req,res,next) => {
    Article.find()
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Found For this User",
                    articles: articles
                });
            }
            articles = articles.filter(article => {
                return article.Author.id == req.userId;
            });
            res.status(200).json({
                message: "Articles created by current user fetched successfuly",
                articles: articles
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}


exports.getUserLatestArticles = (req,res,next) => {

    const userId = req.params.userId;
    Article.find()
        .sort({ _id: -1 })
        .limit(4)
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Found For this User",
                    articles: articles
                });
            }
            console.log(articles);
            articles = articles.filter(article => {
                return article.Author.id == userId;
            });
            res.status(200).json({
                message: "Latest articles created by current user fetched successfuly",
                articles: articles
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.getAllUserArticles = (req,res,next) => {
    const userId = req.params.userId;
    Article.find()
        .sort({ _id: -1 })
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Found For this User",
                    articles: articles
                });
            }
            console.log(articles);
            articles = articles.filter(article => {
                return article.Author.id == userId;
            });
            res.status(200).json({
                message: "Latest articles created by current user fetched successfuly",
                articles: articles
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.getArticlesByTopic = (req,res,next) => {
    const articleTopic = req.params.topic;

    Article.find({Topic: articleTopic})
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "There are no articles for this topic",
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

exports.getUserArticlesByTopic = (req,res,next) => {
    const articleTopic = req.params.topic;
    const userId = req.params.id;

    Article.find({Topic: articleTopic})
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "There are no articles for this topic",
                    articles: articles
                });
            }
            articles = articles.filter(article => {
                return article.Author.id == userId;
            });
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

exports.getLatestArticles = (req,res,next) => {
    Article.find()
        .sort({ _id: -1 })
        .limit(3)
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "No Articles Yet",
                });
            }
            res.status(200).json({
                message: "Latest articles fetched successfully",
                articles : articles
            })
        })
        .catch(error=> {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.getLatestArticlesByTopic = (req,res,next) => {
    const articleTopic = req.params.topic;

    Article.find({Topic: articleTopic})
        .sort({ _id: -1 })
        .limit(4)
        .then(articles => {
            if (!articles) {
                res.status(404).json({
                    message: "There are no articles for this topic",
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
                res.status(404).json({
                    message: "Article Not Found",
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

exports.searchArticlesByTopic = (req,res,next) => {
    const keyword = req.body.keyword;
    const topic = req.body.topic;

    Article.find({
        $or: [{Title: {
            $regex: new RegExp(keyword,  "i")
        }},
        {Body: {
            $regex: new RegExp(keyword,  "i")
        }},
        {"Author.authorName": {
            $regex: new RegExp(keyword,  "i")
        }}],
        Topic:
            // $regex: new RegExp(keyword)
            topic
    }, {
        // _id:1,
        __v:0
    })
    // .collation( { locale: 'en', strength: 2 } )
    .then(articles => {
        res.status(200).json({
            message: "Articles fetched",
            articles: articles
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.searchAllArticles = (req,res,next) => {
    const keyword = req.body.keyword;

    Article.find({
        $or: [{Title: {
            $regex: new RegExp(keyword,  "i")
        }},
        {Body: {
            $regex: new RegExp(keyword,  "i")
        }},
        {"Author.authorName": {
            $regex: new RegExp(keyword,  "i")
        }},
        {Topic: {
            $regex: new RegExp(keyword,  "i")
        }}],
    }, {
        // _id:1,
        __v:0
    })
    // .collation( { locale: 'en', strength: 2 } )
    .then(articles => {
        res.status(200).json({
            message: "Articles fetched",
            articles: articles
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
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
    const authorName = req.username;
    const imgUrl = req.body.link;
    let secure_url = null;
    const public_id = null;
console.log(authorName);
    if (req.file) {
        helperFunctions.uploadArticleCover(req.file.path,"articles/")
            .then(result => {
                console.log(result);
                const secure_url = result.secure_url;
                const public_id = result.public_id;
                return helperFunctions.createNewArticle(res,next,{title,topic,secure_url,public_id,body,author,authorName});
            });
    }
    else {
        secure_url = imgUrl;
        return helperFunctions.createNewArticle(res,next,{title,topic,secure_url,public_id,body,author,authorName});
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