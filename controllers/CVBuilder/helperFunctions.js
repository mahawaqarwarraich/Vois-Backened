const CV = require ("../../models/CVBuilder/cv-builder");


// Cloudinary Configuration
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dkj3d1vvs',
    api_key: "759763123283575",
    api_secret: '_px1mRCmIfA-b8bgz9NADudJCHY'
});

/**
 * function which uploads a given image in cloudinary and returns url and id.
 * It makes use of promise in javascript for better handling of asynchronous code.
 */
exports.uploadCover = (path,cloudinaryFolder) => {
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


const createNewCVObject = (cv) => {
    return new Promise (resolve => {
        if (cv.secure_url && cv.public_id) { //locally uploading of the cover image
            resolve(new CV({
                TemplateId: cv.templateId,
                CvData: cv.data,
                PictureSecureId: cv.secure_url,
                PicturePublicId: cv.public_id,
                Author: {id:cv.author, authorName: cv.authorName}
            }).save());
        }
        else {
            resolve(new CV({
                TemplateId: cv.templateId,
                CvData: cv.data,
                Author: {id:cv.author, authorName: cv.authorName}
            }).save());
        }
    });
}


exports.createNewCV = (res,next,cv) => {
    return createNewCVObject(cv)
        .then (newCV => {
            return res.status(201).json({
                message: "CV Created Successfully",
                cv : newCV
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}


const EditCVObject = (foundCV,cv) => {
    return new Promise (resolve => { //locally uploading of the cover image
        if (cv.secure_url && cv.public_id) {
            foundCV.TemplateId = cv.templateId;
            foundCV.CvData = cv.data;
            foundCV.PictureSecureId = cv.secure_url;
            foundCV.PicturePublicId = cv.public_id;
            resolve(foundCV.save());
        }
        else {
            foundCV.TemplateId = cv.templateId;
            foundCV.CvData = cv.data;
            foundCV.PictureSecureId = cv.secure_url;
            resolve(foundCV.save());
        }
    });
}

exports.EditCV = (res,next,foundCV,cv) => {
    return EditCVObject(foundCV,cv)
        .then (editedCV => {
            return res.status(201).json({
                message: "CV Edited Successfully",
                cv : editedCV
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};