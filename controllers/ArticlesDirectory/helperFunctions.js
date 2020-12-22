const Article = require ("../../models/ArticlesDirectory/article");

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dkj3d1vvs',
    api_key: "759763123283575",
    api_secret: '_px1mRCmIfA-b8bgz9NADudJCHY'
});

exports.uploadArticleCover = (path,cloudinaryFolder) => {
    return new Promise ((resolve, reject) => {
        cloudinary.v2.uploader.upload(path,
            { folder: cloudinaryFolder,type:"private"},
            (error,result)=>{
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
    });
}

const createNewArticleObject = (article) => {
    return new Promise (resolve => {
        if (article.secure_url && article.public_id) {
            resolve(new Article({
                Title: article.title,
                Topic: article.topic,
                PictureSecureId: article.secure_url,
                PicturePublicId: article.public_id,
                Body: article.body,
                Author: {id:article.author, authorName: article.authorName}
            }).save());
        }
        else if (article.secure_url && !article.public_id) {
            resolve(new Article({
                Title: article.title,
                Topic: article.topic,
                PictureSecureId: article.secure_url,
                Body: article.body,
                Author: {id:article.author, authorName: article.authorName}
            }).save());
        }
        else {
            resolve(new Article({
                Title: article.title,
                Topic: article.topic,
                Body: article.body,
                Author: {id:article.author, authorName: article.authorName}
            }).save());
        }
    });
}

exports.createNewArticle = (res,next,article) => {
    return createNewArticleObject(article)
        .then (newArticle => {
            return res.status(201).json({
                message: "New Article Created Successfully",
                article : newArticle
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}



const EditArticleObject = (foundArticle,article) => {
    return new Promise (resolve => {
        if (article.secure_url && article.public_id) {
            foundArticle.Title = article.title;
            foundArticle.Topic = article.topic;
            foundArticle.PictureSecureId = article.secure_url;
            foundArticle.PicturePublicId = article.public_id;
            foundArticle.Body = article.body;
            resolve(foundArticle.save());
        }
        else if (article.secure_url && !article.public_id) {
            foundArticle.Title = article.title;
            foundArticle.Topic = article.topic;
            foundArticle.PictureSecureId = article.secure_url;
            foundArticle.Body = article.body;
            resolve(foundArticle.save());
        }
        else {
            foundArticle.Title = article.title;
            foundArticle.Topic = article.topic;
            foundArticle.PictureSecureId = article.secure_url;
            foundArticle.Body = article.body;
            resolve(foundArticle.save());
        }
    });
}

exports.EditArticle = (res,next,foundArticle,article) => {
    return EditArticleObject(foundArticle,article)
        .then (editedArticle => {
            return res.status(201).json({
                message: "Article Edited Successfully",
                article : editedArticle
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};