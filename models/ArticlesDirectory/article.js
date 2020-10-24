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
    }
});

module.exports = mongoose.model('Article',articleSchema);