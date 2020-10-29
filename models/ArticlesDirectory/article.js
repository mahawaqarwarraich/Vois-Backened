const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    Title : {
        type: String, 
        required: true
    },
    Topic : {
        type: String
    },
    PictureSecureId: {
        type: String
    },
    PicturePublicId : {
        type: String
    },
    PostedOn : {
        type: Date,
        default: Date.now
    },
    Body : {
        type: String
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    Likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Article',articleSchema);