const Profile = require("../../models/User/profile");
const User = require("../../models/User/user");


const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dkj3d1vvs',
    api_key: "759763123283575",
    api_secret: '_px1mRCmIfA-b8bgz9NADudJCHY'
});


exports.getUserProfile = (req,res,next) => {
    const userId = req.params.id;
    let username = null;

    User.findById(userId)
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        username = user.Username;
        return Profile.findById(user.Profile);
    })
    .then(userProfile => {
        res.status(201).json({
            message: "User Profile Fetched Successfully",
            userProfile: userProfile,
            userId : userId,
            username: username
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getCurrentUserProfile = (req,res,next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return Profile.findById(user.Profile);
    })
    .then(userProfile => {
        res.status(201).json({
            message: "Current User Profile Fetched Successfully",
            userProfile: userProfile,
            userId : req.userId
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.uploadProfilePicture = (req,res,next) => {

    let secure_url = null;
    let public_id = null;

    cloudinary.v2.uploader.upload(req.file.path,
        { folder: "profile/"+req.userId+"/"+"dp/",type:"private"},
        (error,result)=>{
            if (error) {
                return res.status(500).json({
                    message: "Failed to uplaod image"
                });
            }
            secure_url = result.secure_url;
            public_id = result.public_id;

            User.findById(req.userId)
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            message: "User not found!"
                        });
                    }
                    return Profile.findById(user.Profile);
                })
                .then(userProfile=> {
                    userProfile.ProfilePhotoSecureId = secure_url;
                    userProfile.ProfilePhotoPublicId = public_id;

                    return userProfile.save();
                }) 
                .then(savedUserProfile => {
                    res.status(201).json({
                        message: "User Profile Picture Updated",
                        picture: savedUserProfile.ProfilePhotoSecureId
                    })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        });

}

exports.uploadDescription = (req,res,next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return Profile.findById(user.Profile);
    })
    .then(userProfile=> {
        userProfile.PersonalDescription = req.body.description;
        return userProfile.save();
    }) 
    .then(savedUserProfile => {
        res.status(201).json({
            message: "User Profile Description Updated Successfully",
            description: savedUserProfile.PersonalDescription
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}