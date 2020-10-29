const ArticleTopic = require ("../../models/ArticlesDirectory/article-topic");
const helperFunctions = require ("./helperFunctions");
const { validationResult } = require("express-validator/check");


exports.getArticleTopics = (req,res,next) => {
    ArticleTopic.find()
    .then(articlesTopics=> {
        if (!articlesTopics) {
            res.status(422).json({
                message: "Could not fetch article topics",
                articleTopics : articlesTopics
            })
        }
        res.status(200).json({
            message: "Article Topics fetched succesfuly",
            articleTopics: articlesTopics
        });
    })
    .catch(error=> {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};

exports.getArticleTopicNames = (req,res,next) => {
    let articleTopics = [];
    ArticleTopic.find()
        .then(topics => {
            if (!topics) {
                res.status(422).json({
                    message: "Server could not fetch article topics",
                    topics: topics
                });                
            }
            articleTopics.push(topics.map(topic=> {
                return topic.TopicName;
            }));
            return articleTopics;
        })  
        .then(articleTopics => {
            res.status(200).json({
                message: "Topic Names Fetched Successfuly",
                topics: articleTopics
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.addNewArticleTopic = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const TopicName = req.body.topicname;
    const Description = req.body.description;

    if (req.file) {
        helperFunctions.uploadArticleCover(req.file.path,"article-topics/")
            .then(result => {
                const secure_url = result.secure_url;
                const public_id = result.public_id;
                return new ArticleTopic({
                    TopicName: TopicName,
                    Description: Description,
                    PictureSecureId: secure_url,
                    PicturePublicId: public_id
                }).save();
            })
            .then(newTopic => {
                res.status(201).json({
                    message: "New Article Topic Added",
                    newTopic: newTopic
                });
            })
            .catch(error => {
                if(!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            });
    }

};