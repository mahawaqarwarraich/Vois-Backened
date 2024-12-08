const { validationResult } = require("express-validator");
const CV = require("../../models/CVBuilder/cv-builder");
const helperFunctions = require("./helperFunctions");


exports.getCV = (req,res,next) => {
    const cvId = req.params.id;

    CV.findById(cvId)
        .then(cv => {
            if(!cv) {
                res.status(404).json({
                    message: "CV Not Found",
                    cv: cv
                });
            }
            res.status(200).json({
                message: "CV fetched Successfuly",
                cv: cv
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.addCV = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const templateId = req.body.templateId;
    const data = req.body.data;
    data = JSON.stringify(data);
    const author = req.userId;
    const authorName = req.username;
    let secure_url = null;
    const public_id = null;
// console.log(authorName);
    if (req.file) {
        helperFunctions.uploadCover(req.file.path,"cv/") // function to upload cover image to the cloud
            .then(result => {
                // console.log(result);
                const secure_url = result.secure_url;
                const public_id = result.public_id;
                return helperFunctions.createNewCV(res,next,{templateId,data,secure_url,public_id,author,authorName});
            });
    }
    else {
        return helperFunctions.createNewCV(res,next,{templateId,data,secure_url,public_id,author,authorName});
    }
};


exports.editCV = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const cvId = req.body.cvId;
    const templateId = req.body.templateId;
    const data = req.body.data;
    data = JSON.stringify(data);
    const author = req.userId;
    const authorName = req.username;
    let secure_url = req.body.link;
    const public_id = null;

    CV.findById(cvId)
    .then (foundCV => {
        if (!foundCV) {
            res.status(404).json({
                message: "CV not found",
            });
        }
        if (foundCV.Author.id != author) {
            return res.status(401).json({
                message: "Not Authorized!"
            })
        }
        if (req.file) {
            // if new file is there then uploading it to the cloud and calling editCV function to save new paths.
            helperFunctions.uploadCover(req.file.path,"cv/")
                .then(result => {
                    // console.log(result);
                    const secure_url = result.secure_url;
                    const public_id = result.public_id;
                    return helperFunctions.EditCV(res,next,foundCV,{templateId,data,secure_url,public_id});
                });
        }
        else {
            // if there's no new local file and file is not changed or there is another method of file uploading
            return helperFunctions.EditCV(res,next,foundCV,{templateId,data,secure_url,public_id});
        }

    });
};
