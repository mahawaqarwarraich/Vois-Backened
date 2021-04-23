const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CVSchema = new Schema({
    TemplateId : {
        type: Number, 
        required: true
    },
    CvData : {
        type: String
    },
    PictureSecureId: {
        type: String,
    },
    PicturePublicId : {
        type: String
    },
    Author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorName : String
    }
});

module.exports = mongoose.model('CV',CVSchema);