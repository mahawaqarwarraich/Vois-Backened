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
        type: String,
        default: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
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
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorName : String
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