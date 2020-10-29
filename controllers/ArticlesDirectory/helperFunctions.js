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
                Author: article.author
            }).save());
        }
        else {
            resolve(new Article({
                Title: article.title,
                Topic: article.topic,
                Body: article.body,
                Author: article.author
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